import { useState } from "react";
import { type Transaction } from "@/types/transaction";
import { formatCurrency, formatTransactionDate } from "./utilities";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TransactionsCardProps {
  transactions: Transaction[];
  title?: string;
  description?: string;
}

export function TransactionsList({
  transactions,
  title = "Recent Transactions",
  description = "Your financial activity for this period",
}: TransactionsCardProps) {
  const [filter, setFilter] = useState<"All" | "Income" | "Expense">("All");

  // Filter transactions based on selected tab
  const filteredTransactions = transactions.filter((tx) => {
    if (filter === "All") return true;
    return tx.type === filter;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {/* Filter Tabs */}
        <div className="px-6 pt-2">
          <Tabs
            value={filter}
            onValueChange={(value) =>
              setFilter(value as "All" | "Income" | "Expense")
            }
            className="mb-4"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="All">All</TabsTrigger>
              <TabsTrigger value="Income">Income</TabsTrigger>
              <TabsTrigger value="Expense">Expenses</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Transactions Table */}
        <div className="px-6">
          {filteredTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden border rounded-md">
                  <div className="grid grid-cols-4 gap-x-4 bg-gray-50 py-3.5 px-4 text-sm font-semibold text-gray-900">
                    <div className="w-32">Date</div>
                    <div>Name</div>
                    <div>Category</div>
                    <div className="text-right">Amount</div>
                  </div>
                  
                  <div className="divide-y divide-gray-200 bg-white">
                    {filteredTransactions.map((tx) => (
                      <div className="grid grid-cols-4 gap-x-4 py-4 px-4 hover:bg-gray-50">
                        <div className="w-32 truncate text-sm font-medium text-gray-900">
                          {formatTransactionDate(tx.date)}
                        </div>
                        <div className="text-sm text-gray-900">
                          <div className="font-medium truncate">{tx.name}</div>
                          {tx.description && (
                            <div className="text-xs text-gray-500 truncate">
                              {tx.description}
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-900">
                          <Badge
                            variant={"destructive"}
                          >
                            {tx.category}
                          </Badge>
                        </div>
                        <div
                          className={`text-sm font-medium text-right ${
                            tx.type === "Expense" ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {tx.type === "Expense" ? "-" : "+"}
                          {formatCurrency(tx.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground border rounded-md">
              No{" "}
              {filter === "All"
                ? "transactions"
                : filter === "Income"
                ? "income"
                : "expenses"}{" "}
              found for this period.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}