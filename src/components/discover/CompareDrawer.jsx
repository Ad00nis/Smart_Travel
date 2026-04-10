import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Star, Plane, MapPin, Calendar, Banknote, GitCompare, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar
} from "recharts";

export default function CompareDrawer({ destinations, budget, days, onRemove, onClose }) {
  if (destinations.length < 2) return null;

  const [a, b] = destinations;
  const costA = (a.daily_cost * days) + (a.avg_flight_cost || 0);
  const costB = (b.daily_cost * days) + (b.avg_flight_cost || 0);

  const barData = [
    { name: "Daily Cost", [a.name]: a.daily_cost, [b.name]: b.daily_cost },
    { name: "Flight Cost", [a.name]: a.avg_flight_cost || 0, [b.name]: b.avg_flight_cost || 0 },
    { name: "Total Est.", [a.name]: costA, [b.name]: costB },
  ];

  const radarData = [
    { metric: "Safety", [a.name]: a.safety_rating * 10, [b.name]: b.safety_rating * 10 },
    { metric: "Rating", [a.name]: (a.rating || 4) * 20, [b.name]: (b.rating || 4) * 20 },
    { metric: "Budget Fit", [a.name]: Math.max(0, 100 - ((costA / budget) * 100)), [b.name]: Math.max(0, 100 - ((costB / budget) * 100)) },
    { metric: "Value/Day", [a.name]: Math.min(100, (1 / a.daily_cost) * 3000), [b.name]: Math.min(100, (1 / b.daily_cost) * 3000) },
  ];

  const winner = costA <= costB ? a : b;

  const StatRow = ({ label, icon: Icon, valueA, valueB, highlight }) => (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-50 last:border-0">
      <div className={cn(
        "text-base text-right font-medium",
        highlight === "a" ? "text-emerald-600" : "text-slate-700"
      )}>
        {valueA}
      </div>
      <div className="flex flex-col items-center justify-center">
        <Icon className="w-4 h-4 text-slate-400 mb-0.5" />
        <span className="text-xs text-slate-400">{label}</span>
      </div>
      <div className={cn(
        "text-base font-medium",
        highlight === "b" ? "text-emerald-600" : "text-slate-700"
      )}>
        {valueB}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 pt-8"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl my-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <GitCompare className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Side-by-Side Comparison</h2>
                <p className="text-base text-slate-400">{days}-day trip • £{budget.toLocaleString()} budget</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            {/* Destination headers */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-end">
                <img src={a.image_url} className="w-16 h-16 rounded-xl object-cover mb-2" alt={a.name} />
                <h3 className="font-bold text-slate-800 text-right">{a.name}</h3>
                <span className="text-xs text-slate-400">{a.country}</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-2xl font-black text-slate-200">VS</span>
              </div>
              <div className="flex flex-col items-start">
                <img src={b.image_url} className="w-16 h-16 rounded-xl object-cover mb-2" alt={b.name} />
                <h3 className="font-bold text-slate-800">{b.name}</h3>
                <span className="text-xs text-slate-400">{b.country}</span>
              </div>
            </div>

            {/* Stats comparison */}
            <div className="bg-slate-50 rounded-2xl p-4">
              <StatRow label="Daily Cost" icon={Banknote} valueA={`£${a.daily_cost}`} valueB={`£${b.daily_cost}`} highlight={a.daily_cost <= b.daily_cost ? "a" : "b"} />
              <StatRow label="Flight" icon={Plane} valueA={`£${a.avg_flight_cost || 0}`} valueB={`£${b.avg_flight_cost || 0}`} highlight={(a.avg_flight_cost||0) <= (b.avg_flight_cost||0) ? "a" : "b"} />
              <StatRow label="Total" icon={Banknote} valueA={`£${costA.toLocaleString()}`} valueB={`£${costB.toLocaleString()}`} highlight={costA <= costB ? "a" : "b"} />
              <StatRow label="Safety" icon={Shield} valueA={`${a.safety_rating}/10`} valueB={`${b.safety_rating}/10`} highlight={a.safety_rating >= b.safety_rating ? "a" : "b"} />
              <StatRow label="Rating" icon={Star} valueA={`${a.rating}/5`} valueB={`${b.rating}/5`} highlight={(a.rating||0) >= (b.rating||0) ? "a" : "b"} />
              <StatRow label="Must See" icon={MapPin} valueA={a.top_attraction} valueB={b.top_attraction} />
              <StatRow label="Season" icon={Calendar} valueA={a.best_season || "—"} valueB={b.best_season || "—"} />
            </div>

            {/* Cost Chart */}
            <div>
              <h4 className="text-base font-semibold text-slate-700 mb-3">Cost Breakdown (£)</h4>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                    <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} />
                    <RechartsTooltip
                      contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
                      formatter={(value) => [`£${value}`, ""]}
                    />
                    <Legend />
                    <Bar dataKey={a.name} fill="#10b981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey={b.name} fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Radar Chart */}
            <div>
              <h4 className="text-base font-semibold text-slate-700 mb-3">Overall Comparison</h4>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "#64748b" }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                    <Radar name={a.name} dataKey={a.name} stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
                    <Radar name={b.name} dataKey={b.name} stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Winner */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 flex items-center gap-4">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <Trophy className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-base text-emerald-700 font-semibold">Best Value Pick</p>
                <p className="text-xs text-emerald-600/70">
                  {winner.name} saves you £{Math.abs(costA - costB).toLocaleString()} on this {days}-day trip
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}