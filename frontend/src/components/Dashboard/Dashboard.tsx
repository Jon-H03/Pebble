import { useState, useMemo, useEffect } from "react";
import { type Transaction } from "@/types/transaction";
import {
  calculateFinancialSummary,
  sortTransactions,
  type Period,
} from "./utilities";
import { fetchTransactions } from "@/services/transactionService";

// Component imports
import { PeriodSelector } from "./PeriodSelector";
import { SummaryCards } from "./SummaryCards";
import { CategorySummary } from "./CategorySummary";
import { TransactionsList } from "./TransactionList";

type SortField = "date" | "amount" | "category" | "name";
type SortOrder = "asc" | "desc";
type TransactionType = "all" | "expense" | "income";

export function Dashboard() {
  // Use state to fetch and load transactions
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Current date for default period
  const currentDate = new Date();

  // State for period selection
  const [selectedPeriod, setSelectedPeriod] = useState<Period>({
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
  });

  // State for transaction filtering
  const [transactionType, setTransactionType] =
    useState<TransactionType>("all");

  // State for sorting
  const [sortBy, setSortBy] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Fetch transactions when period changes
  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchTransactions(
          selectedPeriod.month,
          selectedPeriod.year
        );
        setTransactions(data);
      } catch (error) {
        console.error("Error loading transactions:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load transactions."
        );
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [selectedPeriod.month, selectedPeriod.year]);

  // Calculate financial summary for current period
  const financialSummary = useMemo(() => {
    console.log("Selected data:", transactions);
    console.log("Selected Period:", selectedPeriod);
    console.log(
      "Financial Summary:",
      calculateFinancialSummary(transactions, selectedPeriod)
    );
    return calculateFinancialSummary(transactions, selectedPeriod);
  }, [transactions, selectedPeriod]);

  // Get transactions for the selected period and filter by type
  const filteredTransactions = useMemo(() => {
    // Filter based on the selected transaction type
    if (transactionType === "expense") {
      return transactions.filter((tx) => tx.type === "expense");
    } else if (transactionType === "income") {
      return transactions.filter((tx) => tx.type === "income");
    }
    return transactions;
  }, [transactions, transactionType]);

  // Sort transactions based on sort settings
  const sortedTransactions = useMemo(() => {
    return sortTransactions(filteredTransactions, sortBy, sortOrder);
  }, [filteredTransactions, sortBy, sortOrder]);

  // Handle period change
  const handlePeriodChange = (period: Period) => {
    console.log("Period changed to:", period);
    setSelectedPeriod(period);
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6 mt-[1em]">
        <div className="flex justify-center items-center py-12">
          <div className="text-lg">Loading transactions...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6 mt-[1em]">
        <div className="flex justify-center items-center py-12">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-[1em]">
      {/* Header with period selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold">Financial Dashboard</h2>
        <PeriodSelector
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
        description={`All transactions for ${new Date(
          selectedPeriod.year,
          selectedPeriod.month
        ).toLocaleString("default", { month: "long", year: "numeric" })}`}
      />
    </div>
  );
}