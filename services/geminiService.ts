import { GoogleGenAI, type GenerateContentParameters, Type } from "@google/genai";
import { type ChatMessage, Role, type AiResponse, type QuestionWithOptions } from '../types';
import { SYSTEM_PROMPT, SUMMARIZATION_PROMPT, SUMMARIZATION_THRESHOLD, WITTY_PROMPT_SYSTEM_INSTRUCTION } from '../constants';

// Ensure the API key is available, otherwise throw an error.
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const textModel = 'gemini-2.5-flash';


// Regular expression to identify clarifying questions with numbered options.
const clarifyingQuestionRegex = /^\s*\d+\)/m;

/**
 * Fetches witty, topic-relevant loading messages from the AI.
 */
export const getWittyLoadingMessages = async (topic: string): Promise<string[]> => {
    try {
        const prompt = `${WITTY_PROMPT_SYSTEM_INSTRUCTION}\n\nUser's Business Query: "${topic}"`;
        const response = await ai.models.generateContent({
            model: textModel,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        messages: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        const jsonResponse = JSON.parse(response.text);
        if (jsonResponse?.messages && Array.isArray(jsonResponse.messages)) {
            return jsonResponse.messages;
        }
    } catch (error) {
        console.error("Error generating witty loading messages:", error);
    }
    return []; // Return empty array on failure, don't block the user.
};


/**
 * Summarizes a portion of the conversation history.
 */
const summarizeConversation = async (historyToSummarize: ChatMessage[]): Promise<string> => {
    console.log("Summarizing conversation history...");
    try {
        const content = historyToSummarize.map(msg => `${msg.role}: ${msg.content}`).join('\n');
        
        const response = await ai.models.generateContent({
            model: textModel,
            contents: `${content}\n\n${SUMMARIZATION_PROMPT}`,
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error during summarization:", error);
        return "Summary of previous conversation is unavailable due to an error.";
    }
};

/**
 * Builds the complete request for the Gemini API, including history management.
 */
const buildApiRequest = async (history: ChatMessage[]): Promise<GenerateContentParameters> => {
    let historyForApi = [...history];
    let summaryContent = '';

    const nonSystemMessages = history.filter(m => m.role === Role.USER || m.role === Role.ASSISTANT);

    if (nonSystemMessages.length > SUMMARIZATION_THRESHOLD) {
        const toSummarize = nonSystemMessages.slice(0, -SUMMARIZATION_THRESHOLD);
        const toKeep = nonSystemMessages.slice(-SUMMARIZATION_THRESHOLD);
        
        summaryContent = await summarizeConversation(toSummarize);
        historyForApi = toKeep;
    }

    const contents = historyForApi
      .filter(msg => msg.role === Role.USER || msg.role === Role.ASSISTANT)
      .map(msg => ({
        role: msg.role === Role.USER ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

    const finalSystemPrompt = summaryContent 
        ? `${SYSTEM_PROMPT}\n\nPREVIOUS CONVERSATION SUMMARY:\n${summaryContent}`
        : SYSTEM_PROMPT;

    return {
        model: textModel,
        contents: contents,
        config: {
            systemInstruction: finalSystemPrompt
        }
    };
};

/**
 * Parses clarifying questions from the AI's text response.
 * @param aiText The raw text from the AI.
 * @returns An object containing the preamble text and an array of questions.
 */
const parseClarifyingQuestions = (aiText: string): { text: string; questions: QuestionWithOptions[] } => {
    const questions: QuestionWithOptions[] = [];
    let preambleText = '';
    const lines = aiText.split('\n').filter(Boolean);
    let i = 0;

    // Find the start of the first actual question block
    let firstQuestionIndex = -1;
    for (let j = 0; j < lines.length; j++) {
        const isQuestionLine = !clarifyingQuestionRegex.test(lines[j]);
        const isNextLineAnOption = j + 1 < lines.length && clarifyingQuestionRegex.test(lines[j + 1]);
        if (isQuestionLine && isNextLineAnOption) {
            firstQuestionIndex = j;
            break;
        }
    }
    
    // If no question block is found, treat the whole thing as text
    if (firstQuestionIndex === -1) {
        return { text: aiText, questions: [] };
    }
    
    // Everything before the first question is preamble
    preambleText = lines.slice(0, firstQuestionIndex).join('\n');
    i = firstQuestionIndex;

    // Now, parse the questions and options
    while (i < lines.length) {
        const questionLine = lines[i];
        if (clarifyingQuestionRegex.test(questionLine)) {
            i++; // Skip stray option lines
            continue;
        }

        const currentQuestion: QuestionWithOptions = { question: questionLine, options: [] };
        i++;

        // Collect all subsequent option lines for this question
        while (i < lines.length && clarifyingQuestionRegex.test(lines[i])) {
            currentQuestion.options.push(lines[i].replace(/^\s*\d+\)\s*/, ''));
            i++;
        }
        
        if (currentQuestion.options.length > 0) {
            questions.push(currentQuestion);
        }
    }
    
    return { text: preambleText.trim(), questions };
};


/**
 * Sends the conversation to the Gemini API and gets a response.
 */
export const getAiResponse = async (history: ChatMessage[]): Promise<AiResponse> => {
    try {
        const requestPayload = await buildApiRequest(history);
        const result = await ai.models.generateContent(requestPayload);
        const aiText = result.text.trim();
        
        const planStartIndex = aiText.search(/^Business Plan:/im);

        if (planStartIndex !== -1) {
            // This is a final plan.
            let conversationalText = '';
            let planText = aiText;

            if (planStartIndex > 0) {
                conversationalText = aiText.substring(0, planStartIndex).trim();
                planText = aiText.substring(planStartIndex).trim();
            }
            
            return {
                text: conversationalText,
                planContent: planText,
                questions: [],
            };
        }
        
        // This is a response with clarifying questions or a simple text answer.
        const { text, questions } = parseClarifyingQuestions(aiText);

        return {
            text: text,
            questions: questions,
        };

    } catch (error) {
        console.error("Error fetching AI response:", error);
        return {
            text: "Sorry, I encountered an error. Please try again.",
            questions: [],
        };
    }
};