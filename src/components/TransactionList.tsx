"use client";

interface Transaction {
  _id: string;
  amount: number;
  category: string;
  description?: string;
  date: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  setEditingTransaction: (transaction: Transaction | null) => void;
}

export default function TransactionList({
  transactions,
  setTransactions,
  setEditingTransaction,
}: TransactionListProps) {
  const handleDelete = async (id: string) => {
    const res = await fetch("/api/transactions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setTransactions(transactions.filter((t) => t._id !== id));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-4">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Transactions</h2>
      <ul className="space-y-2">
        {transactions.map((transaction) => (
          <li
            key={transaction._id}
            className="bg-gray-100 p-3 rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="text-gray-800 font-medium">₹{transaction.amount}</p>
              <p className="text-gray-600 text-sm">{transaction.category}</p>
              <p className="text-gray-500 text-xs">
                {new Date(transaction.date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setEditingTransaction(transaction)}
                className="text-blue-500 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(transaction._id)}
                className="text-red-500 text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
