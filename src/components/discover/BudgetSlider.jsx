import React from "react";
import { Slider } from "@/components/ui/slider";
import { Banknote } from "lucide-react";

export default function BudgetSlider({ value, onChange }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-base font-medium text-slate-600 flex items-center gap-2">
          <Banknote className="w-4 h-4 text-emerald-500" />
          Total Budget
        </label>
        <span className="text-lg font-bold text-slate-800">
          £{value.toLocaleString()}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={100}
        max={5000}
        step={50}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-slate-400">
        <span>£100</span>
        <span>£2,500</span>
        <span>£5,000</span>
      </div>
    </div>
  );
}