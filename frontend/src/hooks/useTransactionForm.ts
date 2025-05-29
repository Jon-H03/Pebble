import { useState } from "react";
import { format } from "date-fns";
import { addTransactionToAPI } from "@/services/transactionService";

type UseTransactionFormProps = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export function useTransactionForm({
  onSuccess, onError,
}: UseTransactionFormProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [transactionType, setTransactionType] = useState<"expense" | "income">(
    "expense"
  );
  const [amount, setAmount] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!amount || !category) {
      alert("Please fill in all required fields.");
      return;
    }

    // Create transaction object
    const transaction = {
      date: format(date, "yyyy-MM-dd"),
      type: transactionType,
      amount: parseFloat(amount),
      name,
      category,
      description,
    };

    setIsLoading(true);

    try {
      const result = await addTransactionToAPI(transaction);
      console.log("Transaction added successfully:", result);
      onSuccess?.();

      // Reset form
      setAmount("");
      setName("");
      setCategory("");
      setDescription("");
      setDate(new Date());

      // Show success message
      alert("Transaction added successfully!");
    } catch (error) {
      console.error("Error adding transaction:", error);
      onError?.(error as Error);

      alert(
        `Failed to added transaction : ${
          error instanceof Error ? error.message : "Unkown Error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };
  return {
    date,
    setDate,
    transactionType,
    setTransactionType,
    amount,
    setAmount,
    name,
    setName,
    category,
    setCategory,
    description,
    setDescription,
    handleSubmit,
  };
}
