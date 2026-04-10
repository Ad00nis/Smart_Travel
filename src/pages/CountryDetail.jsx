import React, { useState, useMemo } from "react";
import { fetchCountries, fetchDestinations } from "@/api/destinations";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Shield, Star, MapPin, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import DestinationItem from "@/components/country/DestinationItem";
import DestinationCompareDrawer from "@/components/country/DestnationCompareDrawer";

const categoryColors = {
  Adventure: "bg-orange-100 text-orange-700",
  Relax: "bg-blue-100 text-blue-700",
  Culture: "bg-purple-100 text-purple-700",
  Food: "bg-rose-100 text-rose-700",
};

export default function CountryDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const countryId = urlParams.get("id");

  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  const { data: countries = [], isLoading: loadingCountry } = useQuery({
    queryKey: ["countries"],
    queryFn: () =>
  fetchCountries(),
  });

  const { data: allDestinations = [], isLoading: loadingDests } = useQuery({
   queryKey: ["destinations"],
       queryFn: () =>
     fetchDestinations(),
  });

  const country = useMemo(() => countries.find((c) => c.id === countryId), [countries, countryId]);
  const destinations = useMemo(
    () => allDestinations.filter((d) => d.country_id === countryId),
    [allDestinations, countryId]
  );

  const handleCompareToggle = (dest) => {
    setCompareList((prev) => {
      const exists = prev.find((d) => d.id === dest.id);
      if (exists) return prev.filter((d) => d.id !== dest.id);
      if (prev.length >= 2) return [prev[1], dest];
      return [...prev, dest];
    });
  };

  const isLoading = loadingCountry || loadingDests;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!country) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-slate-500">Country not found.</p>
        <Link to="/Discover"><Button variant="outline">Back to Discover</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Hero */}
      <div className="relative h-72 overflow-hidden">
        <img src={country.image_url} alt={country.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-between p-6 max-w-7xl mx-auto w-full">
          <Link to="/Discover">
            <Button variant="ghost" className="text-white hover:bg-white/20 w-fit">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Countries
            </Button>
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge className={cn("text-xs", categoryColors[country.category])}>{country.category}</Badge>
              {country.secondary_category && (
                <Badge className={cn("text-xs", categoryColors[country.secondary_category])}>{country.secondary_category}</Badge>
              )}
              <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">{country.region}</Badge>
            </div>
            <h1 className="text-4xl font-black text-white">{country.name}</h1>
            <p className="text-white/80 mt-1 max-w-xl">{country.description}</p>
            <div className="flex items-center gap-5 mt-3 text-white/90 text-sm">
              <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-emerald-400" />{country.safety_rating}/10 safety</span>
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400" />{country.rating}</span>
              <span className="font-semibold">£{country.daily_cost}/day avg</span>
              {country.best_season && <span>Best: {country.best_season}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Destinations grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Destinations in {country.name}</h2>
            <p className="text-slate-500 text-sm mt-1">{destinations.length} places to explore</p>
          </div>
          {compareList.length === 2 && (
            <Button
              onClick={() => setShowCompare(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <GitCompare className="w-4 h-4 mr-2" />
              Compare Selected
            </Button>
          )}
        </div>

        {destinations.length === 0 ? (
          <div className="text-center py-20 text-slate-400">No destinations found for this country.</div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((dest, i) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <DestinationItem
                  destination={dest}
                  onCompare={handleCompareToggle}
                  isCompared={!!compareList.find((c) => c.id === dest.id)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {compareList.length > 0 && compareList.length < 2 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-sm px-5 py-3 rounded-full shadow-xl">
            Select 1 more destination to compare
          </div>
        )}
      </div>

      {/* Compare Drawer */}
      <AnimatePresence>
        {showCompare && compareList.length === 2 && (
          <DestinationCompareDrawer
            destinations={compareList}
            onClose={() => setShowCompare(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}