"use client";
import { useEffect, useState } from "react";
import TransactionForm from "./TransactionForm";

interface Transaction {
  _id: string;
  amount: number;
  category: string;
  description?: string;
  date: string;
}

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setTransactions(data);
  };

  const handleAddTransaction = (newTransaction: Transaction) => {
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const handleEditTransaction = async (updatedTransaction: Transaction) => {
    const res = await fetch("/api/transactions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTransaction),
    });

    if (res.ok) {
      setTransactions((prev) =>
        prev.map((tx) =>
          tx._id === updatedTransaction._id ? updatedTransaction : tx
        )
      );
      setEditingTransaction(null);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    await fetch("/api/transactions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setTransactions((prev) => prev.filter((tx) => tx._id !== id));
  };

  return (
    <div>
      <TransactionForm
        onAddTransaction={handleAddTransaction}
        editingTransaction={editingTransaction}
        onEditTransaction={handleEditTransaction}
      />

      <div className="overflow-x-auto p-4">
        <table className="w-full border-collapse border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Amount (₹)</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx._id} className="border-t border-gray-300">
                  <td className="p-2">{tx.category}</td>
                  <td className="p-2 text-green-600">₹ {tx.amount}</td>
                  <td className="p-2 text-gray-500">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>
                  <td className="p-2 flex gap-3">
                    <button
                      onClick={() => setEditingTransaction(tx)}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTransaction(tx._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
