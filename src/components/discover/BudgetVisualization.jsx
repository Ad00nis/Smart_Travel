import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine
} from "recharts";

export default function BudgetVisualization({ destinations, budget, days }) {
  const data = destinations.slice(0, 10).map((d) => {
    const total = (d.daily_cost * days) + (d.avg_flight_cost || 0);
    return {
      name: d.name,
      total,
      daily: d.daily_cost * days,
      flights: d.avg_flight_cost || 0,
      withinBudget: total <= budget,
    };
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6">
      <h3 className="text-base font-semibold text-slate-700 mb-1">Budget Consumption</h3>
      <p className="text-xs text-slate-400 mb-4">Estimated total cost vs. your £{budget.toLocaleString()} budget</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(v) => `£${v}`} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#475569" }} width={80} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
              formatter={(value) => [`£${value.toLocaleString()}`, ""]}
            />
            <ReferenceLine x={budget} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "Budget", fontSize: 11, fill: "#ef4444" }} />
            <Bar dataKey="daily" name="Accommodation & Daily" stackId="cost" radius={[0, 0, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.withinBudget ? "#34d399" : "#fbbf24"} />
              ))}
            </Bar>
            <Bar dataKey="flights" name="Flights" stackId="cost" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.withinBudget ? "#10b981" : "#f59e0b"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}