"use client";
import { useEffect, useState } from "react";

interface Transaction {
  _id: string; 
  amount: number;
  category: string;
  date: string;
  description?: string;
}

interface TransactionFormProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  editingTransaction: Transaction | null;
  setEditingTransaction: React.Dispatch<
    React.SetStateAction<Transaction | null>
  >;
}

const categories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Other",
];

export default function TransactionForm({
  transactions,
  setTransactions,
  editingTransaction,
  setEditingTransaction,
}: TransactionFormProps) {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        amount: String(editingTransaction.amount),
        category: editingTransaction.category,
        description: editingTransaction.description || "",
        date: editingTransaction.date.split("T")[0],
      });
    }
  }, [editingTransaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const transactionData = {
      amount: Number(formData.amount),
      category: formData.category,
      description: formData.description,
      date: new Date(formData.date).toISOString(),
    };

    if (editingTransaction?._id) {
      const updatedTransaction = {
        id: editingTransaction._id,
        ...transactionData,
      };

      const res = await fetch("/api/transactions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTransaction),
      });

      if (res.ok) {
        const updatedData: Transaction = await res.json();
        setTransactions(
          transactions.map((t) => (t._id === updatedData._id ? updatedData : t))
        );
        setEditingTransaction(null);
      }
    } else {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });

      if (res.ok) {
        const newTransaction: Transaction = await res.json();
        setTransactions([newTransaction, ...transactions]);
      }
    }

    setFormData({
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-700 text-center">
        {editingTransaction ? "Edit Transaction" : "Add Transaction"}
      </h2>

      <input
        type="number"
        placeholder="Amount"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        required
        className="w-full p-2 border rounded-lg"
      />

      <label
        htmlFor="category"
        className="block text-sm font-medium text-gray-700"
      >
        Category
      </label>
      <select
        id="category"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        required
        className="w-full p-2 border rounded-lg"
      >
        <option value="" disabled>
          Select Category
        </option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

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
        {editingTransaction ? "Update Transaction" : "Add Transaction"}
      </button>
    </form>
  );
}
