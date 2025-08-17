import { type ChatMessage, type AiResponse, Role } from '../types';

const MOCK_LATENCY = 800; // ms

// --- MOCK DATA ---

const MOCK_WITTY_MESSAGES = [
    "Brewing up some mock data...",
    "Assembling a fake business plan...",
    "Consulting my imaginary experts...",
    "Definitely not hitting a real API..."
];

const MOCK_CLARIFYING_QUESTIONS: AiResponse = {
    text: "I can certainly help with that. To create a detailed business plan for a coffee shop in Berlin, I need a bit more information. Please answer the following questions:",
    questions: [
        {
            question: "What is your estimated initial budget for setting up the coffee shop?",
            options: [
                "1) Less than €25,000 (approx. $27,000 USD)",
                "2) €25,000 - €50,000 (approx. $27,000 - $54,000 USD)",
                "3) €50,000 - €100,000 (approx. $54,000 - $108,000 USD)",
                "4) More than €100,000 (approx. > $108,000 USD)"
            ]
        },
        {
            question: "Which neighborhood in Berlin are you targeting?",
            options: [
                "1) Mitte (High-traffic, touristy, higher rent)",
                "2) Kreuzberg (Trendy, artistic, competitive)",
                "3) Prenzlauer Berg (Family-friendly, established cafe scene)",
                "4) Neukölln (Up-and-coming, diverse, lower rent)",
                "5) I'm undecided"
            ]
        },
        {
            question: "What will be the primary focus of your coffee shop's menu?",
            options: [
                "1) Specialty coffee and beans (e.g., single-origin, pour-over)",
                "2) Coffee with a wide selection of cakes and pastries",
                "3) Coffee and a full brunch/lunch menu",
                "4) Quick service, grab-and-go coffee and snacks"
            ]
        }
    ],
    planContent: undefined
};

const MOCK_BUSINESS_PLAN: AiResponse = {
    text: "Thank you for the details. I've analyzed your responses and prepared a comprehensive business plan for your coffee shop.",
    questions: [],
    planContent: `Business Plan: Specialty Coffee Shop in Kreuzberg, Berlin

## Executive Summary
This business plan outlines the launch of a specialty coffee shop in Kreuzberg, Berlin, targeting discerning coffee lovers with high-quality, single-origin beans. With an initial capital requirement of \`€41,000\`, the plan focuses on community engagement and a superior customer experience to stand out in a competitive market. Key risks include high competition and rising rents, which will be mitigated through a strong brand identity and efficient operations.

## Company Formation and Legal Steps
- **Business Registration (Gewerbeanmeldung):** This is the first step. You must register your business at the local trade office (Gewerbeamt) in Kreuzberg. The cost is approximately \`€20-€60\`.
- **Tax Number (Steuernummer):** After registration, the tax office (Finanzamt) will issue you a tax number, which is essential for all invoicing.
- **Health Department Permit (Gesundheitszeugnis):** All staff handling food and drinks need a health certificate. This involves a short training session and costs around \`€25\` per person.
- **Restaurant License (Gaststättenkonzession):** Since you'll be serving prepared drinks and food, you will need a license from the Ordnungsamt. This involves submitting a detailed business plan, floor plan, and proof of expertise. > This can be a time-consuming process, so start early!

## Initial Capital Requirements
Here is a breakdown of the estimated one-time startup costs, assuming a 60sqm location.
\`\`\`json
{
  "initialCapital": [
    { "item": "Rent Deposit (3 months at €2,500/month)", "cost": 7500, "currency": "EUR" },
    { "item": "High-End Espresso Machine & Grinder", "cost": 12000, "currency": "EUR" },
    { "item": "Shop Fit-Out & Furniture", "cost": 15000, "currency": "EUR" },
    { "item": "Initial Inventory (Coffee, Milk, etc.)", "cost": 4000, "currency": "EUR" },
    { "item": "POS System & Software", "cost": 1500, "currency": "EUR" },
    { "item": "Licenses & Legal Fees", "cost": 1000, "currency": "EUR" }
  ]
}
\`\`\`
> One major risk is underestimating renovation costs. Always have a contingency fund of at least 20%.

## Recurring Expenses
These are the estimated monthly operational costs.
\`\`\`json
{
  "recurringExpenses": [
    { "item": "Rent & Utilities", "monthlyCost": 2500, "currency": "EUR" },
    { "item": "Staff Salaries (2 baristas)", "monthlyCost": 5000, "currency": "EUR" },
    { "item": "Coffee Bean & Milk Supply", "monthlyCost": 2000, "currency": "EUR" },
    { "item": "Other Supplies (cups, pastries)", "monthlyCost": 800, "currency": "EUR" },
    { "item": "Marketing & Social Media", "monthlyCost": 400, "currency": "EUR" },
    { "item": "Insurance & Accounting", "monthlyCost": 300, "currency": "EUR" }
  ]
}
\`\`\`
Managing monthly cash flow is critical. The high cost of salaries is a significant factor to monitor.

## Key Financial Drivers
\`\`\`json
{
    "drivers": [
        { "name": "Rent & Utilities", "type": "rent", "initialCost": 2500 },
        { "name": "Staff Salaries", "type": "staff", "initialCost": 5000 },
        { "name": "Marketing Spend", "type": "marketing", "initialCost": 400 },
        { "name": "Coffee Bean Supply", "type": "generic", "initialCost": 2000 }
    ]
}
\`\`\`


## Market and Competition Analysis
- **Target Audience:** Kreuzberg is home to a mix of young professionals, students, artists, and tourists. Your marketing should appeal to those who appreciate quality and authenticity.
- **Competition:** The coffee scene in Kreuzberg is highly saturated. Key competitors include \`Five Elephant\`, \`The Barn\`, and \`Bonanza Coffee Roasters\`.
- **Unique Selling Proposition (USP):** Your opportunity is to create a niche. Focus on a specific origin of coffee, host cupping events, or create a unique, cozy atmosphere that stands out. > A strong social media presence, especially on Instagram, is not optional—it's essential for survival here.

## SWOT Analysis

### Strengths
- **Prime Location:** Kreuzberg has high foot traffic and a target demographic that values specialty coffee.
- **Authentic Focus:** A clear focus on single-origin, high-quality beans appeals to coffee connoisseurs.
- **Lean Model:** Starting with a small, focused menu keeps initial inventory costs down.

### Weaknesses
- **High Competition:** The area is saturated with established and popular coffee shops.
- **Brand Recognition:** As a new entrant, building a brand and customer loyalty will be a challenge.
- **Dependence on Key Staff:** The quality of the baristas is critical to the customer experience.

### Opportunities
- **Community Building:** Host workshops, cupping events, or local art displays to become a community hub.
- **Local Partnerships:** Collaborate with local bakeries for pastries or businesses for corporate coffee subscriptions.
- **Retail Sales:** Sell branded merchandise and bags of your specialty coffee beans for customers to take home.

### Threats
- **Rising Rents:** Gentrification in Kreuzberg could lead to significant rent increases in the future.
- **Economic Downturn:** A recession could reduce discretionary spending on premium coffee.
- **Changing Consumer Tastes:** New coffee trends or a shift in neighborhood demographics could impact demand.
`
};


// --- MOCK API FUNCTIONS ---

export const getWittyLoadingMessages = async (topic: string): Promise<string[]> => {
    console.log("MOCK: Getting witty messages for topic:", topic);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(MOCK_WITTY_MESSAGES);
        }, MOCK_LATENCY / 2);
    });
};

export const getAiResponse = async (history: ChatMessage[]): Promise<AiResponse> => {
    console.log("MOCK: Getting AI response. History:", history);
    const lastUserMessage = history[history.length - 1];
    
    // Simple logic: If the user's message includes "My Answer:", we assume they've
    // answered the questions and we should return the business plan.
    // Otherwise, we return the clarifying questions.
    const isSubmittingAnswers = lastUserMessage.content.includes("My Answer:");

    return new Promise(resolve => {
        setTimeout(() => {
            if (isSubmittingAnswers) {
                console.log("MOCK: Returning business plan.");
                resolve(MOCK_BUSINESS_PLAN);
            } else {
                console.log("MOCK: Returning clarifying questions.");
                resolve(MOCK_CLARIFYING_QUESTIONS);
            }
        }, MOCK_LATENCY);
    });
};
