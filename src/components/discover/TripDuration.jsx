import React from "react";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "lucide-react";

export default function TripDuration({ value, onChange }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-500" />
          Trip Duration
        </label>
        <span className="text-lg font-bold text-slate-800">
          {value} {value === 1 ? "day" : "days"}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={1}
        max={30}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-slate-400">
        <span>1 day</span>
        <span>15 days</span>
        <span>30 days</span>
      </div>
    </div>
  );
}