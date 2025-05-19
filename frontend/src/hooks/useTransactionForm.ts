import { useState } from "react";
import { format } from "date-fns";
import { type TransactionFormData } from "@/types/transaction";

type UseTransactionFormProps = {
  onAddTransaction: (transaction: TransactionFormData) => void;
};

export function useTransactionForm({ onAddTransaction }: UseTransactionFormProps) {
    const [date, setDate] = useState<Date>(new Date());
    const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
    const [amount, setAmount] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!amount || !category) {
            alert('Please fill in all required fields.');
            return;
        }

        // Create transaction object
        const transaction: TransactionFormData = {
            date: format(date, 'yyyy-MM-dd'),
            type: transactionType, 
            amount: parseFloat(amount),
            name,
            category,
            description,
        };

        // Pass to parent component
        onAddTransaction(transaction);

        // Reset form
        setAmount('');
        setName('');
        setCategory('');
        setDescription('');
        setDate(new Date());
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
    handleSubmit
  };
}