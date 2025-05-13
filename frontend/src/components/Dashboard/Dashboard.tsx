import { useState, useMemo } from "react";
import { type Transaction } from "@/types/transaction";
import {
  calculateFinancialSummary,
  getTransactionsForPeriod,
  sortTransactions,
  type Period,
} from "./utilities";

// Component imports
import { PeriodSelector } from "./PeriodSelector";
import { SummaryCards } from "./SummaryCards";
import { CategorySummary } from "./CategorySummary";
import { TransactionsList } from "./TransactionList";

// Sample data for development (can be removed later)
const sampleTransactions: Transaction[] = [
  {
    id: 1,
    date: "2025-05-01",
    type: "income",
    amount: 3250.0,
    name: "Monthly Salary",
    category: "Salary",
    description: "Direct deposit",
  },
  {
    id: 2,
    date: "2025-05-03",
    type: "expense",
    amount: 78.35,
    name: "Weekly Groceries",
    category: "Food & Dining",
    description: "Trader Joe's",
  },
  {
    id: 3,
    date: "2025-05-05",
    type: "expense",
    amount: 45.0,
    name: "Gas",
    category: "Transportation",
    description: "Shell station",
  },
  {
    id: 4,
    date: "2025-05-06",
    type: "expense",
    amount: 120.5,
    name: "Electric Bill",
    category: "Utilities",
    description: "Monthly service",
  },
  {
    id: 5,
    date: "2025-05-09",
    type: "expense",
    amount: 65.99,
    name: "Dinner",
    category: "Food & Dining",
    description: "Restaurant with friends",
  },
  {
    id: 6,
    date: "2025-04-01",
    type: "income",
    amount: 3250.0,
    name: "Monthly Salary",
    category: "Salary",
    description: "Direct deposit",
  },
  {
    id: 7,
    date: "2025-04-08",
    type: "expense",
    amount: 3250.0,
    name: "Monthly Salary",
    category: "Dinner",
    description: "Direct deposit",
  },
];

interface DashboardProps {
  transactions: Transaction[];
}

type SortField = "date" | "amount" | "category" | "name";
type SortOrder = "asc" | "desc";
type TransactionType = "all" | "expense" | "income";

export function Dashboard({ transactions = [] }: DashboardProps) {
  // just use sample data for now
  const data = sampleTransactions;

  // Current date for default period
  const currentDate = new Date();

  // State for period selection
  const [selectedPeriod, setSelectedPeriod] = useState<Period>({
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
  });

  // State for transaction filtering
  const [transactionType, ] =
    useState<TransactionType>("all");

  // State for sorting
  const [sortBy, ] = useState<SortField>("date");
  const [sortOrder, ] = useState<SortOrder>("desc");

  // Calculate financial summary for current period
  const financialSummary = useMemo(() => {
    console.log("Selected data:", data);
    console.log("Selected Period:", selectedPeriod);
    console.log("Financial Summary:", calculateFinancialSummary(data, selectedPeriod));
    return calculateFinancialSummary(data, selectedPeriod);
  }, [data, selectedPeriod]);

  // Get transactions for the selected period and filter by type
  const filteredTransactions = useMemo(() => {
    const periodTransactions = getTransactionsForPeriod(data, selectedPeriod);

    // Filter based on the selected transaction type
    if (transactionType === "expense") {
      return periodTransactions.filter((tx) => tx.type === "expense");
    } else if (transactionType === "income") {
      periodTransactions.filter((tx) => tx.type === "income");
    }
    return periodTransactions;
  }, [data, selectedPeriod, transactionType]);

  // Sort transactions based on sort settings
  const sortedTransactions = useMemo(() => {
    return sortTransactions(filteredTransactions, sortBy, sortOrder);
  }, [filteredTransactions, sortBy, sortOrder]);

  // Handle period change
  const handlePeriodChange = (period: Period) => {
    console.log("Period changed to:", period);
    setSelectedPeriod(period);
  };


  return (
    <div className="space-y-6 mt-[1em]">
      {/* Header with period selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold">Financial Dashboard</h2>
        <PeriodSelector
          transactions={sortedTransactions}
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
        />
      </div>

      {/* Summary Cards */}
      <SummaryCards
        income={financialSummary.income}
        expenses={financialSummary.expenses}
        net={financialSummary.net}
      />

      {/* Top Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CategorySummary
          title="Top Expense Categories"
          description="Where your money is going"
          categories={financialSummary.topExpenseCategories}
          total={financialSummary.expenses}
          type="expense"
        />
        
        <CategorySummary
          title="Top Income Sources"
          description="Where your money is coming from"
          categories={financialSummary.topIncomeCategories}
          total={financialSummary.income}
          type="income"
        />
      </div>

      {/* Transactions Card */}
      <TransactionsList 
        transactions={sortedTransactions}
        title="Transactions"
        description={`All transactions for ${new Date(selectedPeriod.year, selectedPeriod.month).toLocaleString('default', { month: 'long', year: 'numeric' })}`}
      />
    </div>
  );
}
