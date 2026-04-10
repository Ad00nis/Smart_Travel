import React from "react";
import { Compass, Palmtree, Landmark, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

const interests = [
  { value: "Adventure", icon: Compass, color: "text-orange-500", bg: "bg-orange-50", activeBg: "bg-orange-500", desc: "Thrills & nature" },
  { value: "Relax", icon: Palmtree, color: "text-blue-500", bg: "bg-blue-50", activeBg: "bg-blue-500", desc: "Beach & wellness" },
  { value: "Culture", icon: Landmark, color: "text-purple-500", bg: "bg-purple-50", activeBg: "bg-purple-500", desc: "History & art" },
  { value: "Food", icon: UtensilsCrossed, color: "text-rose-500", bg: "bg-rose-50", activeBg: "bg-rose-500", desc: "Cuisine & markets" },
];

export default function InterestSelector({ value, onChange }) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-slate-600">Travel Interest</label>
      <div className="grid grid-cols-2 gap-2">
        {interests.map((interest) => {
          const Icon = interest.icon;
          const isActive = value === interest.value;
          return (
            <button
              key={interest.value}
              onClick={() => onChange(interest.value)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 text-left",
                isActive
                  ? `${interest.activeBg} border-transparent text-white shadow-lg shadow-${interest.activeBg}/20`
                  : `${interest.bg} border-transparent hover:border-slate-200`
              )}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-white" : interest.color)} />
              <div>
                <div className={cn("text-sm font-semibold", isActive ? "text-white" : "text-slate-700")}>
                  {interest.value}
                </div>
                <div className={cn("text-xs", isActive ? "text-white/80" : "text-slate-400")}>
                  {interest.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}