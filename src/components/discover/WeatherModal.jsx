import React from "react";
import { X, Thermometer, CloudRain, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ALL_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const climateColors = {
  Tropical: { bg: "bg-green-500", light: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  Arid: { bg: "bg-yellow-500", light: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
  Temperate: { bg: "bg-sky-500", light: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
  Continental: { bg: "bg-indigo-500", light: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  Mediterranean: { bg: "bg-orange-500", light: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  Polar: { bg: "bg-blue-400", light: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
};

const climateDescriptions = {
  Tropical: "Hot and humid year-round with a distinct wet season.",
  Arid: "Hot and dry with very little rainfall throughout the year.",
  Temperate: "Mild temperatures with moderate rainfall spread across the year.",
  Continental: "Cold winters, warm summers, with moderate seasonal rainfall.",
  Mediterranean: "Hot dry summers and mild wet winters.",
  Polar: "Very cold year-round with extreme winter conditions.",
};

export default function WeatherModal({ destination, onClose }) {
  const colors = climateColors[destination.climate_type] || climateColors.Temperate;
  const rainySet = new Set(destination.rainy_months || []);
  const peakSet = new Set(destination.peak_months || []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={cn("px-6 py-5", colors.light, colors.border, "border-b")}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Weather in {destination.name}
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">{destination.region || destination.country_name || ""}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Key stats */}
          <div className="flex gap-4 mt-4">
            {destination.avg_temp_celsius != null && (
              <div className="flex items-center gap-2">
                <div className={cn("p-2 rounded-lg", colors.bg)}>
                  <Thermometer className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Avg Temp</p>
                  <p className={cn("text-lg font-bold", colors.text)}>{destination.avg_temp_celsius}°C</p>
                </div>
              </div>
            )}
            {destination.climate_type && (
              <div className="flex items-center gap-2">
                <div className={cn("p-2 rounded-lg", colors.bg)}>
                  <Sun className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Climate</p>
                  <p className={cn("text-lg font-bold", colors.text)}>{destination.climate_type}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Climate description */}
        {destination.climate_type && (
          <div className="px-6 pt-4">
            <p className="text-sm text-slate-500 leading-relaxed">
              {climateDescriptions[destination.climate_type]}
            </p>
          </div>
        )}

        {/* Monthly calendar */}
        <div className="px-6 py-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Monthly Overview</p>
          <div className="grid grid-cols-6 gap-2">
            {ALL_MONTHS.map((month) => {
              const isRainy = rainySet.has(month);
              const isPeak = peakSet.has(month);
              return (
                <div
                  key={month}
                  className={cn(
                    "rounded-lg p-2 text-center text-xs font-medium border transition-all",
                    isPeak
                      ? cn(colors.light, colors.border, colors.text)
                      : isRainy
                      ? "bg-blue-50 border-blue-200 text-blue-600"
                      : "bg-slate-50 border-slate-100 text-slate-500"
                  )}
                >
                  <div>{month}</div>
                  <div className="mt-1">
                    {isPeak ? (
                      <Sun className="w-3 h-3 mx-auto text-current" />
                    ) : isRainy ? (
                      <CloudRain className="w-3 h-3 mx-auto text-blue-400" />
                    ) : (
                      <div className="w-3 h-3 mx-auto" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Sun className={cn("w-3 h-3", colors.text)} />
              <span>Best months</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <CloudRain className="w-3 h-3 text-blue-400" />
              <span>Rainy season</span>
            </div>
          </div>
        </div>

        {/* Best season from DB */}
        {destination.best_season && (
          <div className="px-6 pb-5">
            <div className={cn("rounded-xl px-4 py-3", colors.light, "border", colors.border)}>
              <p className="text-xs text-slate-500">Recommended travel window</p>
              <p className={cn("font-semibold mt-0.5", colors.text)}>{destination.best_season}</p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}