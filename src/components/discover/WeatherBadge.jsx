import React from "react";
import { Thermometer } from "lucide-react";
import { cn } from "@/lib/utils";

const climateColors = {
  Tropical: "bg-green-100 text-green-700",
  Arid: "bg-yellow-100 text-yellow-700",
  Temperate: "bg-sky-100 text-sky-700",
  Continental: "bg-indigo-100 text-indigo-700",
  Mediterranean: "bg-orange-100 text-orange-700",
  Polar: "bg-blue-100 text-blue-700",
};

export default function WeatherBadge({ destination, onClick }) {
  if (!destination.avg_temp_celsius && !destination.climate_type) return null;

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-opacity hover:opacity-80",
        climateColors[destination.climate_type] || "bg-slate-100 text-slate-600"
      )}
    >
      <Thermometer className="w-3 h-3" />
      {destination.avg_temp_celsius != null && (
        <span>{destination.avg_temp_celsius}°C</span>
      )}
      {destination.climate_type && (
        <span className="hidden sm:inline">· {destination.climate_type}</span>
      )}
    </button>
  );
}