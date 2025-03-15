"use client";
import { useEffect, useState } from "react";

interface Transaction {
  _id: string;
  amount: number;
  category: string;
  description?: string;
  date: string;
}

interface TransactionFormProps {
  onAddTransaction: (newTransaction: Transaction) => void;
  editingTransaction: Transaction | null;
  onEditTransaction: (updatedTransaction: Transaction) => void;
}

export default function TransactionForm({
  onAddTransaction,
  editingTransaction,
  onEditTransaction,
}: TransactionFormProps) {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0], // Default to today's date
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        amount: String(editingTransaction.amount),
        category: editingTransaction.category,
        description: editingTransaction.description || "",
        date: editingTransaction.date.split("T")[0], // Format date for input
      });
      setIsEditing(true);
    }
  }, [editingTransaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const transactionData: Transaction = {
      _id: editingTransaction?._id || "",
      amount: Number(formData.amount),
      category: formData.category,
      description: formData.description,
      date: new Date(formData.date).toISOString(),
    };

    if (isEditing) {
      await onEditTransaction(transactionData);
      setIsEditing(false);
    } else {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });

      if (res.ok) {
        const newTransaction: Transaction = await res.json();
        onAddTransaction(newTransaction);
      }
    }

    setFormData({
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().split("T")[0], // Reset to today's date
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-700 text-center">
        {isEditing ? "Edit Transaction" : "Add Transaction"}
      </h2>

      <input
        type="number"
        placeholder="Amount"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        required
        className="w-full p-2 border rounded-lg"
      />

      <input
        type="text"
        placeholder="Category"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        required
        className="w-full p-2 border rounded-lg"
      />

      <input
        type="text"
        placeholder="Description (Optional)"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        className="w-full p-2 border rounded-lg"
      />

      <label htmlFor="date" className="block text-sm font-medium text-gray-700">
        Date
      </label>
      <input
        id="date"
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        required
        className="w-full p-2 border rounded-lg"
      />

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded-lg"
      >
        {isEditing ? "Update Transaction" : "Add Transaction"}
      </button>
    </form>
  );
}
