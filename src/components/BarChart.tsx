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

interface ChartData {
  name: string;
  total: number;
}

const allMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function ExpenseChart() {
  const [data, setData] = useState<ChartData[]>([]);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions");
      if (!res.ok) throw new Error("Failed to fetch transactions");
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

      const completeData = allMonths.map((month) => ({
        name: month,
        total: groupedData[month] || 0,
      }));

      setData(completeData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions(); 

    const interval = setInterval(fetchTransactions, 5000); 

    return () => clearInterval(interval); 
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" fill="#4F46E5" barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}
