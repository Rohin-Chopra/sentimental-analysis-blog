"use client";

import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";

const data01 = [
  { name: "POSITIVE", value: 400 },
  { name: "NEGATIVE", value: 300 },
  { name: "NEUTRAL", value: 300 },
];

type Props = {
  reviews: {
    name: string;
    value: number;
  }[];
};

const COLORS = ["#8B0000", "#006400", "#DAA520"];

export function SentimentalPieChart({ reviews }: Props) {
  return (
    <PieChart className="mb-8" width={400} height={400}>
      <Pie
        dataKey="value"
        isAnimationActive={false}
        data={reviews}
        cx="50%"
        cy="50%"
        outerRadius={80}
        fill="#8884d8"
        label
      >
        {reviews.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Legend />
      <Tooltip />
    </PieChart>
  );
}
