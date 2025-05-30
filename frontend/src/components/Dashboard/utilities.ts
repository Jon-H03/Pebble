import { type Transaction } from "@/types/transaction";
import { parseISO, format, isWithinInterval, startOfMonth, endOfMonth } from "date-fns";

// Formats a number as currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};


// Interface for period selection
export interface Period {
  month: number;
  year: number;
}


// Interface for financial summary data
export interface FinancialSummary {
  income: number;
  expenses: number;
  net: number;
  topExpenseCategories: [string, number][];
  topIncomeCategories: [string, number][];
}

// Get transactions for a specific month and year
export const getTransactionsForPeriod = (
  transactions: Transaction[],
  period: Period
): Transaction[] => {
  const startDate = startOfMonth(new Date(period.year, period.month));
  const endDate = endOfMonth(new Date(period.year, period.month));
  
  return transactions.filter(tx => {
    try {
      const txDate = parseISO(tx.date);
      return isWithinInterval(txDate, { start: startDate, end: endDate });
    } catch {
      // Fallback for development with string dates (MM-DD-YYYY format)
      const [month, _, year] = tx.date.split('-').map(Number);
      return month - 1 === period.month && year === period.year;
    }
  });
};


// Calculates financial summary for current month
export const calculateFinancialSummary = (
  transactions: Transaction[]
): FinancialSummary => {
  // Get transactions for the specified period
  const periodTransactions = transactions;
  
  // Calculate income total
  const income = periodTransactions
    .filter(tx => tx.type === "Income")
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  // Calculate expenses total
  const expenses = periodTransactions
    .filter(tx => tx.type === "Expense")
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  // Calculate net (income - expenses)
  const net = income - expenses;
  
  // Group expenses by category
  const expensesByCategory: Record<string, number> = {};
  
  periodTransactions
    .filter(tx => tx.type === "Expense")
    .forEach(tx => {
      expensesByCategory[tx.category] = (expensesByCategory[tx.category] || 0) + tx.amount;
    });
  
  // Sort expense categories by amount and take top 3
  const topExpenseCategories = Object.entries(expensesByCategory)
    .sort(([, amountA], [, amountB]) => amountB - amountA)
    .slice(0, 3);
    
  // Group income by category
  const incomeByCategory: Record<string, number> = {};
  
  periodTransactions
    .filter(tx => tx.type === "Income")
    .forEach(tx => {
      incomeByCategory[tx.category] = (incomeByCategory[tx.category] || 0) + tx.amount;
    });
    
  // Sort income categories by amount and take top 3
  const topIncomeCategories = Object.entries(incomeByCategory)
    .sort(([, amountA], [, amountB]) => amountB - amountA)
    .slice(0, 3);
    
  
  return {
    income,
    expenses,
    net,
    topExpenseCategories,
    topIncomeCategories,
  };
};


// Sort transactions by different criteria
export const sortTransactions = (
  transactions: Transaction[],
  sortBy: 'date' | 'amount' | 'category' | 'name' = 'date',
  sortOrder: 'asc' | 'desc' = 'desc'
): Transaction[] => {
  return [...transactions].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
        break;
      case 'amount':
        comparison = b.amount - a.amount;
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
    }
    
    return sortOrder === 'asc' ? -comparison : comparison;
  });
};


// Format a transaction date string
export const formatTransactionDate = (dateStr: string) => {
  try {
    // Try using parseISO for ISO format dates (YYYY-MM-DD)
    const date = parseISO(dateStr);
    return format(date, "MMM d, yyyy");
  } catch {
    // Fallback to creating a standard Date object
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return format(date, "MMM d, yyyy");
      }
    } catch {}
    
    // If all parsing fails, return the original string
    return dateStr;
  }
};