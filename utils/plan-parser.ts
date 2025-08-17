import { type FinancialData, type CapitalItem, type ExpenseItem, type SWOT, type FinancialDriver } from '../types';

interface ParsedPlan {
  title: string;
  executiveSummary: string | null;
  sections: { title: string; content: string }[];
  financialData: FinancialData | null;
  swotData: SWOT | null;
}

/**
 * Parses financial data from JSON code blocks within a markdown string.
 */
function parseFinancialData(markdown: string): FinancialData | null {
  const jsonRegex = /```json\s*([\s\S]*?)\s*```/g;
  let match;
  
  const foundCapital: CapitalItem[] = [];
  const foundExpenses: ExpenseItem[] = [];
  let foundDrivers: FinancialDriver[] = [];
  
  while ((match = jsonRegex.exec(markdown)) !== null) {
    try {
      const jsonContent = JSON.parse(match[1]);
      
      if (Array.isArray(jsonContent.initialCapital)) {
        jsonContent.initialCapital.forEach((item: any) => {
          if (item && typeof item.item === 'string' && typeof item.cost === 'number' && typeof item.currency === 'string') {
            foundCapital.push(item as CapitalItem);
          }
        });
      }
      
      if (Array.isArray(jsonContent.recurringExpenses)) {
        jsonContent.recurringExpenses.forEach((item: any) => {
          if (item && typeof item.item === 'string' && typeof item.monthlyCost === 'number' && typeof item.currency === 'string') {
            foundExpenses.push(item as ExpenseItem);
          }
        });
      }

      if (Array.isArray(jsonContent.drivers)) {
        jsonContent.drivers.forEach((driver: any) => {
            if (driver && typeof driver.name === 'string' && typeof driver.type === 'string' && typeof driver.initialCost === 'number') {
                foundDrivers.push(driver as FinancialDriver);
            }
        });
      }

    } catch (e) {
      // Ignore malformed JSON blocks
    }
  }

  if (foundCapital.length === 0 && foundExpenses.length === 0) {
    return null;
  }

  const totalInitialCapital = foundCapital.reduce((sum, item) => sum + item.cost, 0);
  const totalRecurringExpenses = foundExpenses.reduce((sum, item) => sum + item.monthlyCost, 0);
  const currency = foundCapital[0]?.currency || foundExpenses[0]?.currency || '';

  return {
    initialCapital: foundCapital,
    recurringExpenses: foundExpenses,
    totalInitialCapital,
    totalRecurringExpenses,
    currency,
    drivers: foundDrivers,
  };
}


/**
 * Parses SWOT analysis data from a markdown string.
 */
function parseSwotData(markdown: string): SWOT | null {
  const swotSectionRegex = /##\s*SWOT Analysis([\s\S]*)/i;
  const swotMatch = markdown.match(swotSectionRegex);

  if (!swotMatch || !swotMatch[1]) {
    return null;
  }

  const swotContent = swotMatch[1];
  const result: SWOT = {
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
  };

  const parseCategory = (category: keyof SWOT, categoryName: string): void => {
    const categoryRegex = new RegExp(`###\\s*${categoryName}([\\s\\S]*?)(?=\\n###|$)`, 'i');
    const categoryMatch = swotContent.match(categoryRegex);
    
    if (categoryMatch && categoryMatch[1]) {
      const itemsRegex = /-\s*(.*)/g;
      let itemMatch;
      while ((itemMatch = itemsRegex.exec(categoryMatch[1])) !== null) {
        result[category].push(itemMatch[1].trim());
      }
    }
  };

  parseCategory('strengths', 'Strengths');
  parseCategory('weaknesses', 'Weaknesses');
  parseCategory('opportunities', 'Opportunities');
  parseCategory('threats', 'Threats');
  
  if (Object.values(result).some(arr => arr.length > 0)) {
    return result;
  }

  return null;
}


/**
 * Parses the entire markdown plan into a structured object.
 * @param markdown The full markdown content from the AI.
 * @returns A ParsedPlan object.
 */
export function parsePlan(markdown: string): ParsedPlan {
  const lines = markdown.split('\n');
  const title = lines[0]?.trim() || 'Untitled Business Plan';

  const financialData = parseFinancialData(markdown);
  const swotData = parseSwotData(markdown);
  
  const sectionSplitRegex = /(?=^##\s.*$)/m;
  const jsonRegex = /```json\s*([\s\S]*?)\s*```/g;

  // Remove title from content for section parsing
  const contentWithoutTitle = lines.slice(1).join('\n');
  const parts = contentWithoutTitle.split(sectionSplitRegex).filter(Boolean);

  let executiveSummary: string | null = null;
  const sections: { title: string; content: string }[] = [];

  for (const part of parts) {
    const trimmedPart = part.trim();
    if (!trimmedPart) continue;

    const sectionLines = trimmedPart.split('\n');
    const sectionTitle = sectionLines[0].replace(/^##\s*/, '');
    const rawContent = sectionLines.slice(1).join('\n').replace(jsonRegex, '').trim();

    if (sectionTitle.toLowerCase() === 'executive summary') {
      executiveSummary = rawContent;
    } else {
        // Exclude empty sections that might just contain JSON
        if(rawContent) {
            sections.push({ title: sectionTitle, content: rawContent });
        }
    }
  }

  return {
    title,
    executiveSummary,
    sections,
    financialData,
    swotData,
  };
}
