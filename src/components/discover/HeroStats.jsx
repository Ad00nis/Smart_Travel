import React from "react";
import { Globe, Plane, Shield, TrendingDown } from "lucide-react";

export default function HeroStats({ destinations, budget, days }) {
  const affordable = destinations.filter(
    (d) => (d.daily_cost * days + (d.avg_flight_cost || 0)) <= budget
  ).length;
  const avgSafety = destinations.length
    ? (destinations.reduce((s, d) => s + d.safety_rating, 0) / destinations.length).toFixed(1)
    : 0;
  const cheapest = destinations.length
    ? destinations.reduce((min, d) => (d.daily_cost < min.daily_cost ? d : min), destinations[0])
    : null;

  const stats = [
    { label: "Countries", value: destinations.length, icon: Globe, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Within Budget", value: affordable, icon: Plane, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Avg. Safety", value: `${avgSafety}/10`, icon: Shield, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Best Value", value: cheapest ? `£${cheapest.daily_cost}/d` : "—", icon: TrendingDown, color: "text-rose-500", bg: "bg-rose-50" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${stat.bg}`}>
              <Icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-800">{stat.value}</p>
              <p className="text-xs text-slate-400">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}