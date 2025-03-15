"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Define type for chart data
interface ChartData {
  name: string;
  total: number;
}

export default function ExpenseChart() {
  // Explicitly type the state
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const res = await fetch("/api/transactions");
      const transactions = await res.json();

      const groupedData = transactions.reduce(
        (
          acc: Record<string, number>,
          { date, amount }: { date: string; amount: number }
        ) => {
          const month = new Date(date).toLocaleString("default", {
            month: "short",
          });
          acc[month] = (acc[month] || 0) + amount;
          return acc;
        },
        {}
      );

      setData(
        Object.entries(groupedData).map(([name, total]) => ({
          name,
          total: total as number,
        }))
      );
    };

    fetchTransactions();
  }, []);

  return (
    <ResponsiveContainer width="50%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" fill="#4F46E5" />
      </BarChart>
    </ResponsiveContainer>
  );
}
