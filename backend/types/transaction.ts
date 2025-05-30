export type Transaction = {
  id: number;
  date: string;
  type: "Expense" | "Income";
  amount: number;
  name: string;
  category: string;
  description: string;
};

export type TransactionFormData = Omit<Transaction, 'id'>;
