// In-line SVGs for icons to avoid extra HTTP requests
const riskIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="inline-block w-4 h-4 -mt-1 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.293 2.293a1 1 0 011.414 0L10 8.586l5.293-6.293a1 1 0 111.414 1.414L11.414 10l5.293 6.293a1 1 0 01-1.414 1.414L10 11.414l-5.293 6.293a1 1 0 01-1.414-1.414L8.586 10 3.293 3.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>`;
const opportunityIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="inline-block w-4 h-4 -mt-1 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>`;

/**
 * Wraps strategic keywords in a raw text string with styled spans for later HTML parsing.
 * @param text The raw text content.
 * @returns Text with keywords wrapped in spans.
 */
export function highlightKeywords(text: string): string {
    // Regex to find keywords that are whole words and not part of other words.
    const riskRegex = /\b(risk|risks|warning|challenge|threat|downside|drawback|con|cons)\b/gi;
    const oppRegex = /\b(opportunity|opportunities|recommendation|advantage|strength|benefit|upside|pro|pros)\b/gi;

    // We replace the text with spans that have Tailwind classes.
    // These classes will be interpreted by the browser when the HTML is rendered.
    // Note: This simple regex approach assumes keywords are not inside code blocks or HTML attributes.
    // Given the controlled AI output, this is a safe assumption for this app.

    let highlightedText = text.replace(
        riskRegex,
        (match) => `<span class="inline-flex items-center bg-red-500/10 text-red-300 ring-1 ring-inset ring-red-500/20 rounded-md px-2 py-0.5 font-semibold">${riskIcon} ${match}</span>`
    );

    highlightedText = highlightedText.replace(
        oppRegex,
        (match) => `<span class="inline-flex items-center bg-green-500/10 text-green-300 ring-1 ring-inset ring-green-500/20 rounded-md px-2 py-0.5 font-semibold">${opportunityIcon} ${match}</span>`
    );
    
    return highlightedText;
}
