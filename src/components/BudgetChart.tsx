import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Define transaction type
interface Transaction {
  _id: string;
  amount: number;
  category: string;
  date: string;
}

// Sample budgets (you can replace this with dynamic budgets from MongoDB)
const budgetData = {
  Food: 5000,
  Transport: 2000,
  Shopping: 3000,
  Bills: 4000,
  Entertainment: 2500,
  Other: 1500,
};

interface Props {
  transactions: Transaction[];
}

export default function BudgetChart({ transactions }: Props) {
  // Aggregate actual spending by category
  const data = Object.entries(budgetData).map(([category, budget]) => {
    const actual = transactions
      .filter((tx) => tx.category === category)
      .reduce((sum, tx) => sum + tx.amount, 0);

    return { category, budget, actual };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="actual" fill="#8884d8" name="Actual Spending" />
        <Bar dataKey="budget" fill="#82ca9d" name="Budget" />
      </BarChart>
    </ResponsiveContainer>
  );
}
