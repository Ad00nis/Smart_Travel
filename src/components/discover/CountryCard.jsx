import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Shield, Star, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import WeatherBadge from "@/components/discover/WeatherBadge";
import WeatherModal from "@/components/discover/WeatherModal";

const categoryColors = {
  Adventure: "bg-orange-100 text-orange-700",
  Relax: "bg-blue-100 text-blue-700",
  Culture: "bg-purple-100 text-purple-700",
  Food: "bg-rose-100 text-rose-700",
};

export default function CountryCard({ country, score, explanation, budget, days }) {
  const [showWeather, setShowWeather] = useState(false);
  const totalCost = (country.daily_cost * days) + (country.avg_flight_cost || 0);
  const budgetUsage = Math.min((totalCost / budget) * 100, 100);
  const withinBudget = totalCost <= budget;

  return (
    <>
      <Link
        to={`/CountryDetail?id=${country.id}`}
        className="destination-card group block bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={country.image_url}
            alt={country.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Score badge */}
          <div className="absolute top-3 left-3">
            <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-sm font-bold text-slate-800">{Math.round(score)}%</span>
            </div>
          </div>

          {/* Region badge + weather */}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs">
              {country.region}
            </Badge>
            <div onClick={(e) => { e.preventDefault(); setShowWeather(true); }}>
              <WeatherBadge destination={country} onClick={() => {}} />
            </div>
          </div>

          {/* Name overlay */}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-xl font-bold text-white">{country.name}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{country.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            <Badge className={cn("text-xs font-medium", categoryColors[country.category])}>
              {country.category}
            </Badge>
            {country.secondary_category && (
              <Badge className={cn("text-xs font-medium", categoryColors[country.secondary_category])}>
                {country.secondary_category}
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-slate-600">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>{country.safety_rating}/10</span>
            </div>
            <div className="flex items-center gap-1 text-slate-600">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{country.rating}</span>
            </div>
            <span className="font-semibold text-slate-800">
              £{country.daily_cost}<span className="text-xs text-slate-400 font-normal">/day</span>
            </span>
          </div>

          {/* Budget bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Est. total ({days}d + flights)</span>
              <span className={cn("font-semibold", withinBudget ? "text-emerald-600" : "text-red-500")}>
                £{totalCost.toLocaleString()}
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700",
                  budgetUsage <= 60 ? "bg-emerald-400" : budgetUsage <= 85 ? "bg-amber-400" : "bg-red-400"
                )}
                style={{ width: `${budgetUsage}%` }}
              />
            </div>
          </div>

          {/* Top attraction */}
          <div className="bg-slate-50 rounded-lg px-3 py-2">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Must see</p>
            <p className="text-sm font-medium text-slate-700">{country.top_attraction}</p>
          </div>

          {/* CTA */}
          <div className="flex items-center justify-end gap-1 text-emerald-600 text-sm font-medium pt-1">
            View destinations <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </Link>

      <AnimatePresence>
        {showWeather && (
          <WeatherModal destination={country} onClose={() => setShowWeather(false)} />
        )}
      </AnimatePresence>
    </>
  );
}