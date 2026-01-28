"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

interface ChartProps {
  data: { date: string; HENRY_HUB: number; TTF: number; JKM: number }[];
}

export default function PriceLineChart({ data }: ChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="HENRY_HUB" stroke="#0f172a" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="TTF" stroke="#0ea5e9" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="JKM" stroke="#f97316" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
