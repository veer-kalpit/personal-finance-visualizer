"use client";
import { useEffect, useState } from "react";
import TransactionList from "@/components/TransactionList";
import TransactionForm from "@/components/TransactionForm";
import ExpenseChart from "@/components/ExpenseChart";
import BudgetChart from "@/components/BudgetChart";
import SummaryCard from "@/components/SummaryCard";
import BarChart from "@/components/BarChart";

// ✅ Define Transaction Type
interface Transaction {
  _id: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const [isClient, setIsClient] = useState(false); // ✅ Fix Hydration Error

  // ✅ Fetch Transactions after Mounting
  useEffect(() => {
    setIsClient(true); // Ensure client-side rendering

    const fetchTransactions = async () => {
      try {
        const res = await fetch("/api/transactions");
        if (!res.ok) throw new Error("Failed to fetch transactions");
        const data: Transaction[] = await res.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  // ✅ Calculate Summary Data
  const totalExpenses = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const categoryTotals: { [key: string]: number } = {};
  transactions.forEach((tx) => {
    categoryTotals[tx.category] =
      (categoryTotals[tx.category] || 0) + tx.amount;
  });

  // ✅ Sort transactions to get the most recent ones
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* ✅ Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <SummaryCard title="Total Expenses" value={`₹ ${totalExpenses}`} />
        <SummaryCard
          title="Categories Tracked"
          value={Object.keys(categoryTotals).length}
        />
        <SummaryCard title="Total Transactions" value={transactions.length} />
      </div>

      {/* ✅ Recent Transactions */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Recent Transactions</h2>
        <ul className="space-y-2">
          {recentTransactions.map((tx) => (
            <li key={tx._id} className="border-b py-2 flex justify-between">
              <span className="font-medium">{tx.category}</span>
              <span className="text-gray-600">₹ {tx.amount}</span>
            </li>
          ))}
          {recentTransactions.length === 0 && (
            <li>
              <p className="text-gray-500">No recent transactions.</p>
            </li>
          )}
        </ul>
      </div>

      {/* ✅ Expense & Budget Charts */}
      {isClient && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">
                Category-wise Expenses
              </h2>
              <ExpenseChart transactions={transactions} />
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Budget vs Actual</h2>
              <BudgetChart transactions={transactions} />
            </div>
          </div>
          <div className=" p-4 rounded-lg shadow mt-6 items-center self-center justify-center">
            <h2 className="text-lg font-semibold mb-2">Monthly Total Expenses</h2>
            <BarChart />
          </div>
        </div>
      )}

      {/* ✅ Full Transaction List */}
      <TransactionForm
        transactions={transactions}
        setTransactions={setTransactions}
        editingTransaction={editingTransaction}
        setEditingTransaction={setEditingTransaction}
      />
      <TransactionList
        transactions={transactions}
        setTransactions={setTransactions}
        setEditingTransaction={setEditingTransaction}
      />
    </div>
  );
}
