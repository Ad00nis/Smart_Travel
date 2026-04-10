import React, { useState, useMemo } from "react";
import { fetchCountries } from "@/api/destinations";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search, SlidersHorizontal, BarChart3, LayoutGrid, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import BudgetSlider from "@/components/discover/BudgetSlider";
import InterestSelector from "@/components/discover/InterestSelector";
import RegionSelector from "@/components/discover/RegionSelector";
import TripDuration from "@/components/discover/TripDuration";
import CountryCard from "@/components/discover/CountryCard";
import BudgetVisualization from "@/components/discover/BudgetVisualization";
import HeroStats from "@/components/discover/HeroStats";

function computeScore(country, interest, budget, days) {
  let interestMatch = 0.1;
  if (country.category === interest) interestMatch = 1.0;
  else if (country.secondary_category === interest) interestMatch = 0.5;

  const totalCost = (country.daily_cost * days) + (country.avg_flight_cost || 0);
  const budgetRatio = totalCost / budget;
  let budgetCompat = 0;
  if (budgetRatio <= 0.5) budgetCompat = 1.0;
  else if (budgetRatio <= 0.75) budgetCompat = 0.85;
  else if (budgetRatio <= 1.0) budgetCompat = 0.6;
  else if (budgetRatio <= 1.3) budgetCompat = 0.2;
  else budgetCompat = 0.0;

  const score = (interestMatch * 0.6 + budgetCompat * 0.4) * 100;

  const budgetPct = Math.round(budgetRatio * 100);
  const parts = [];
  if (interestMatch === 1.0) parts.push(`Perfect match for ${interest} travel`);
  else if (interestMatch === 0.5) parts.push(`Partial match — also great for ${interest}`);
  else parts.push(`Not primarily a ${interest} destination`);

  if (budgetRatio <= 1) parts.push(`Uses ${budgetPct}% of your £${budget.toLocaleString()} budget`);
  else parts.push(`Exceeds budget by £${(totalCost - budget).toLocaleString()}`);

  return { score, explanation: parts.join(". ") + "." };
}

export default function Discover() {
  const [budget, setBudget] = useState(1500);
  const [interest, setInterest] = useState("Adventure");
  const [region, setRegion] = useState("All");
  const [days, setDays] = useState(7);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [showChart, setShowChart] = useState(false);

  const { data: countries = [], isLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: () =>
  fetchCountries(),
  });

  const scored = useMemo(() => {
  return countries
    .map((c) => {
      const { score, explanation } = computeScore(c, interest, budget, days);

      const totalCost = (c.daily_cost * days) + (c.avg_flight_cost || 0);

      return {
        ...c,
        _score: score,
        _explanation: explanation,
        _totalCost: totalCost
      };
    })
    .filter((c) => {
      // remove countries over budget
      if (c._totalCost > budget) return false;

      // region filter
      if (region !== "All" && c.region !== region) return false;

      // search filter
      if (search) {
        const q = search.toLowerCase();
        return c.name.toLowerCase().includes(q);
      }

      return true;
    })
    .sort((a, b) => b._score - a._score);
}, [countries, interest, budget, days, region, search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-emerald-400 rounded-full" />
              <span className="text-emerald-400 text-sm font-medium tracking-wider uppercase">Smart Travel</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight">
              Find Your Perfect
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Budget Destination
              </span>
            </h1>
            <p className="mt-4 text-slate-300 text-lg max-w-lg leading-relaxed">
              Browse 35 countries ranked by your interests and budget. Tap any country to explore its best destinations.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="-mt-10 mb-8 relative z-10">
          <HeroStats destinations={scored} budget={budget} days={days} />
        </div>

        {/* Controls bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search countries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white border-slate-200 h-11"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className={cn(showFilters && "bg-slate-800 hover:bg-slate-700")}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button
              variant={showChart ? "default" : "outline"}
              onClick={() => setShowChart(!showChart)}
              className={cn(showChart && "bg-emerald-600 hover:bg-emerald-700")}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Chart
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:w-72 flex-shrink-0"
              >
                <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-6 sticky top-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800">Preferences</h3>
                    <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setShowFilters(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <BudgetSlider value={budget} onChange={setBudget} />
                  <TripDuration value={days} onChange={setDays} />
                  <InterestSelector value={interest} onChange={setInterest} />
                  <RegionSelector value={region} onChange={setRegion} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <AnimatePresence>
              {showChart && scored.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <BudgetVisualization destinations={scored} budget={budget} days={days} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-700">{scored.length}</span> countries ranked for you
              </p>
              <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
                <LayoutGrid className="w-3.5 h-3.5" />
                Sorted by utility score
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              </div>
            ) : scored.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-400">No countries match your criteria.</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {scored.map((country, i) => (
                  <motion.div
                    key={country.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <CountryCard
                      country={country}
                      score={country._score}
                      explanation={country._explanation}
                      budget={budget}
                      days={days}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}