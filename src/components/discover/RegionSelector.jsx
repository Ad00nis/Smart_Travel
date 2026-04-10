import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";

const regions = [
  { value: "All", label: "All Regions" },
  { value: "Asia", label: "Asia" },
  { value: "Europe", label: "Europe" },
  { value: "Africa", label: "Africa" },
  { value: "South America", label: "South America" },
  { value: "North America", label: "North America" },
  { value: "Oceania", label: "Oceania" },
  { value: "Middle East", label: "Middle East" },
];

export default function RegionSelector({ value, onChange }) {
  return (
    <div className="space-y-3">
      <label className="text-base font-medium text-slate-600 flex items-center gap-2">
        <Globe className="w-4 h-4 text-emerald-500" />
        Location Preference
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 bg-white border-slate-200">
          <SelectValue placeholder="Select region" />
        </SelectTrigger>
        <SelectContent>
          {regions.map((r) => (
            <SelectItem key={r.value} value={r.value}>
              {r.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}