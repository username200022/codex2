import { type SWOT } from '../types';

/**
 * Parses SWOT analysis data from a markdown string.
 * @param markdown The full markdown content from the AI.
 * @returns A SWOT object if valid data is found, otherwise null.
 */
export function parseSwotData(markdown: string): SWOT | null {
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
    // Regex to find a category heading (e.g., ### Strengths) and capture all content until the next heading or end of string
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
  
  // Return the result only if at least one category has items
  if (Object.values(result).some(arr => arr.length > 0)) {
    return result;
  }

  return null;
}