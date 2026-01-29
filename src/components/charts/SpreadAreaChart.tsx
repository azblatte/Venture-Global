"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

interface ChartProps {
  data: { date: string; ttfHhSpread: number; jkmHhSpread: number }[];
}

export default function SpreadAreaChart({ data }: ChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%" minHeight={200}>
        <AreaChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="ttfHhSpread" stackId="1" stroke="#14b8a6" fill="#99f6e4" />
          <Area type="monotone" dataKey="jkmHhSpread" stackId="2" stroke="#fb7185" fill="#fecdd3" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
