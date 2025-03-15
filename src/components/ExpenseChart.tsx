import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface Transaction {
  _id: string;
  amount: number;
  category: string;
  date: string;
}

interface Props {
  transactions: Transaction[];
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#FF4567",
  "#845EC2",
];

export default function ExpenseChart({ transactions }: Props) {
  const data = transactions.reduce<{ name: string; value: number }[]>(
    (acc, tx) => {
      const existing = acc.find((d) => d.name === tx.category);
      if (existing) {
        existing.value += tx.amount;
      } else {
        acc.push({ name: tx.category, value: tx.amount });
      }
      return acc;
    },
    []
  );

  return (
    <PieChart width={400} height={300}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((_, index) => (
          <Cell key={index} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}
