export type Transaction = {
  id: number;
  date: string;
  type: "expense" | "income";
  amount: number;
  name: string;
  category: string;
  description: string;
};

export type TransactionFormData = Omit<Transaction, 'id'>;
