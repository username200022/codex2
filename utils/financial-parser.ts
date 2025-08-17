import { type FinancialData, type CapitalItem, type ExpenseItem, type FinancialDriver } from '../types';

/**
 * Parses financial data from JSON code blocks within a markdown string.
 * @param markdown The full markdown content from the AI.
 * @returns A FinancialData object if valid data is found, otherwise null.
 */
export function parseFinancialData(markdown: string): FinancialData | null {
  const jsonRegex = /```json\s*([\s\S]*?)\s*```/g;
  let match;
  
  const foundCapital: CapitalItem[] = [];
  const foundExpenses: ExpenseItem[] = [];
  const foundDrivers: FinancialDriver[] = [];
  
  while ((match = jsonRegex.exec(markdown)) !== null) {
    try {
      const jsonContent = JSON.parse(match[1]);
      
      // Validate and add initial capital items
      if (Array.isArray(jsonContent.initialCapital)) {
        jsonContent.initialCapital.forEach((item: any) => {
          if (item && typeof item.item === 'string' && typeof item.cost === 'number' && typeof item.currency === 'string') {
            foundCapital.push(item as CapitalItem);
          }
        });
      }
      
      // Validate and add recurring expense items
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
      console.error("Failed to parse financial JSON:", e);
      // Ignore errors in one block and try to parse the next
    }
  }

  // If we didn't find any valid data, return null.
  if (foundCapital.length === 0 && foundExpenses.length === 0) {
    return null;
  }

  const totalInitialCapital = foundCapital.reduce((sum, item) => sum + item.cost, 0);
  const totalRecurringExpenses = foundExpenses.reduce((sum, item) => sum + item.monthlyCost, 0);
  
  // Assume currency is consistent, take from the first available item.
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