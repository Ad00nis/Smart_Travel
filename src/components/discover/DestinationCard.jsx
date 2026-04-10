import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Shield, Star, MapPin, Info, GitCompare, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import WeatherBadge from "@/components/discover/WeatherBadge";
import WeatherModal from "@/components/discover/WeatherModal";
import { AnimatePresence } from "framer-motion";

const categoryColors = {
  Adventure: "bg-orange-100 text-orange-700",
  Relax: "bg-blue-100 text-blue-700",
  Culture: "bg-purple-100 text-purple-700",
  Food: "bg-rose-100 text-rose-700",
};

export default function DestinationCard({ destination, score, explanation, budget, days, onCompare, isCompared }) {
  const [showWeather, setShowWeather] = useState(false);
  const totalCost = (destination.daily_cost * days) + (destination.avg_flight_cost || 0);
  const budgetUsage = Math.min((totalCost / budget) * 100, 100);
  const withinBudget = totalCost <= budget;

  return (
    <div className="destination-card group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={destination.image_url}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Score badge */}
        <div className="absolute top-3 left-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-base font-bold text-slate-800">{Math.round(score)}%</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                <p className="text-xs font-medium">Utility Score Breakdown</p>
                <p className="text-xs text-slate-500 mt-1">{explanation}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Region badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs">
            {destination.region}
          </Badge>
        </div>

        {/* Name overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-xl font-bold text-white">{destination.name}</h3>
          <div className="flex items-center gap-1 text-white/80 text-base">
            <MapPin className="w-3.5 h-3.5" />
            {destination.country}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <p className="text-base text-slate-500 line-clamp-2 leading-relaxed">
          {destination.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <Badge className={cn("text-xs font-medium", categoryColors[destination.category])}>
            {destination.category}
          </Badge>
          {destination.secondary_category && (
            <Badge className={cn("text-xs font-medium", categoryColors[destination.secondary_category])}>
              {destination.secondary_category}
            </Badge>
          )}
          <WeatherBadge destination={destination} onClick={() => setShowWeather(true)} />
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-slate-600">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>{destination.safety_rating}/10</span>
          </div>
          <div className="flex items-center gap-1 text-slate-600">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{destination.rating}</span>
          </div>
          <span className="font-semibold text-slate-800">
            £{destination.daily_cost}<span className="text-xs text-slate-400 font-normal">/day</span>
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
                "h-full rounded-full transition-all duration-700 ease-out",
                budgetUsage <= 60 ? "bg-emerald-400" :
                budgetUsage <= 85 ? "bg-amber-400" : "bg-red-400"
              )}
              style={{ width: `${budgetUsage}%` }}
            />
          </div>
          <div className="text-xs text-slate-400 text-right">
            {Math.round(budgetUsage)}% of budget
          </div>
        </div>

        {/* Top attraction */}
        <div className="bg-slate-50 rounded-lg px-3 py-2">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Must see</p>
          <p className="text-sm font-medium text-slate-700">{destination.top_attraction}</p>
        </div>

        {/* Weather modal */}
        <AnimatePresence>
          {showWeather && (
            <WeatherModal destination={destination} onClose={() => setShowWeather(false)} />
          )}
        </AnimatePresence>

        {/* Compare button */}
        <Button
          variant={isCompared ? "default" : "outline"}
          size="sm"
          className={cn(
            "w-full",
            isCompared && "bg-emerald-500 hover:bg-emerald-600"
          )}
          onClick={() => onCompare(destination)}
        >
          <GitCompare className="w-4 h-4 mr-2" />
          {isCompared ? "Selected for Compare" : "Add to Compare"}
        </Button>
      </div>
    </div>
  );
}