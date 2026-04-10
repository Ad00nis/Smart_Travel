import React from "react";
import { X, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function StatRow({ label, a, b, higherIsBetter = true }) {
  const aNum = parseFloat(a);
  const bNum = parseFloat(b);
  const aWins = higherIsBetter ? aNum >= bNum : aNum <= bNum;
  return (
    <div className="grid grid-cols-3 items-center py-2.5 border-b border-slate-100 last:border-0">
      <span className={cn("text-sm font-semibold text-right pr-3", aWins ? "text-emerald-600" : "text-slate-600")}>{a}</span>
      <span className="text-xs text-slate-400 text-center">{label}</span>
      <span className={cn("text-sm font-semibold text-left pl-3", !aWins ? "text-emerald-600" : "text-slate-600")}>{b}</span>
    </div>
  );
}

export default function DestinationCompareDrawer({ destinations, onClose }) {
  const [a, b] = destinations;
  if (!a || !b) return null;

  const aCost = a.daily_cost;
  const bCost = b.daily_cost;
  const bestValue = aCost <= bCost ? a : b;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Destination Comparison</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Destination headers */}
        <div className="grid grid-cols-2 gap-4 p-5">
          {[a, b].map((dest) => (
            <div key={dest.id} className="text-center">
              <img
                src={dest.image_url}
                alt={dest.name}
                className="w-full h-28 object-cover rounded-xl mb-2"
              />
              <p className="font-bold text-slate-800">{dest.name}</p>
              {bestValue.id === dest.id && (
                <div className="inline-flex items-center gap-1 mt-1 bg-emerald-50 text-emerald-700 text-xs font-medium px-2 py-1 rounded-full">
                  <Trophy className="w-3 h-3" /> Best Value
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="px-5 pb-5">
          <div className="bg-slate-50 rounded-xl p-4">
            <StatRow label="Daily Cost" a={`£${a.daily_cost}`} b={`£${b.daily_cost}`} higherIsBetter={false} />
            <StatRow label="Safety" a={`${a.safety_rating}/10`} b={`${b.safety_rating}/10`} higherIsBetter={true} />
            <StatRow label="Rating" a={`${a.rating}★`} b={`${b.rating}★`} higherIsBetter={true} />
            {a.avg_temp_celsius && b.avg_temp_celsius && (
              <StatRow label="Avg Temp" a={`${a.avg_temp_celsius}°C`} b={`${b.avg_temp_celsius}°C`} higherIsBetter={true} />
            )}
            <div className="grid grid-cols-3 items-start py-2.5 border-b border-slate-100">
              <p className="text-sm text-slate-700 text-right pr-3">{a.top_attraction}</p>
              <span className="text-xs text-slate-400 text-center">Must See</span>
              <p className="text-sm text-slate-700 text-left pl-3">{b.top_attraction}</p>
            </div>
            <div className="grid grid-cols-3 items-start py-2.5">
              <p className="text-sm text-slate-700 text-right pr-3">{a.best_season || "—"}</p>
              <span className="text-xs text-slate-400 text-center">Best Season</span>
              <p className="text-sm text-slate-700 text-left pl-3">{b.best_season || "—"}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}