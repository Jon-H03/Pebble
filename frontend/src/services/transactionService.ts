import { type Transaction } from "@/types/transaction";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888/.netlify/functions';

export async function fetchTransactions(month: number, year: number) {
  try {
    const response = await fetch(`${API_URL}/get-transactions?month=${month}&year=${year}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch transactions');
    }

    const result = await response.json();
    return result.transactions || [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
}

export async function addTransactionToAPI(transaction: Transaction) {
  try {
    const response = await fetch(`${API_URL}/add-transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add transaction');
    }

    return response.json();
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
}