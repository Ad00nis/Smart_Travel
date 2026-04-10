import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Star, GitCompare } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import WeatherBadge from "@/components/discover/WeatherBadge";
import WeatherModal from "@/components/discover/WeatherModal";

const categoryColors = {
  Adventure: "bg-orange-100 text-orange-700",
  Relax: "bg-blue-100 text-blue-700",
  Culture: "bg-purple-100 text-purple-700",
  Food: "bg-rose-100 text-rose-700",
};

export default function DestinationItem({ destination, onCompare, isCompared }) {
  const [showWeather, setShowWeather] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
        {/* Image */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={destination.image_url}
            alt={destination.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3">
            <h3 className="text-lg font-bold text-white">{destination.name}</h3>
          </div>
          {destination.avg_temp_celsius && (
            <div className="absolute top-3 right-3" onClick={() => setShowWeather(true)}>
              <WeatherBadge destination={destination} onClick={() => setShowWeather(true)} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <p className="text-sm text-slate-500 line-clamp-2">{destination.description}</p>

          <div className="flex flex-wrap gap-1.5">
            <Badge className={cn("text-xs", categoryColors[destination.category])}>
              {destination.category}
            </Badge>
          </div>

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

          <div className="bg-slate-50 rounded-lg px-3 py-2">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Must see</p>
            <p className="text-sm font-medium text-slate-700">{destination.top_attraction}</p>
          </div>

          <Button
            variant={isCompared ? "default" : "outline"}
            size="sm"
            className={cn("w-full", isCompared && "bg-emerald-500 hover:bg-emerald-600")}
            onClick={() => onCompare(destination)}
          >
            <GitCompare className="w-4 h-4 mr-2" />
            {isCompared ? "Selected for Compare" : "Add to Compare"}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showWeather && (
          <WeatherModal destination={destination} onClose={() => setShowWeather(false)} />
        )}
      </AnimatePresence>
    </>
  );
}