import React, { useState } from "react";
import { fetchDestinations } from "@/api/destinations";
import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2, GripVertical, MapPin, Calendar, Clock, Loader2, Sparkles, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import DayCard from "@/components/itinerary/DayCard";
import ItineraryAI from "@/components/itinerary/ItineraryAI";
import ExportButton from "@/components/itinerary/ExportButton";

export default function Itinerary() {
  const [selectedDest, setSelectedDest] = useState(null);
  const [days, setDays] = useState([]);
  const [tripTitle, setTripTitle] = useState("");
  const [generating, setGenerating] = useState(false);
  const [search, setSearch] = useState("");

  const { data: destinations = [], isLoading } = useQuery({
    queryKey: ["destinations"],
    queryFn: () =>
  fetchDestinations(),
  });

  const filtered = destinations.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    (d.country_name && d.country_name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSelectDest = (dest) => {
    setSelectedDest(dest);
    setTripTitle(`${dest.name} Trip`);
    setDays([]);
  };

  const addDay = () => {
    setDays((prev) => [
      ...prev,
      { id: Date.now(), label: `Day ${prev.length + 1}`, activities: [] },
    ]);
  };

  const removeDay = (id) => {
    setDays((prev) => prev.filter((d) => d.id !== id));
  };

  const updateDay = (id, updated) => {
    setDays((prev) => prev.map((d) => (d.id === id ? { ...d, ...updated } : d)));
  };

  const handleAIGenerated = (generatedDays) => {
    setDays(generatedDays.map((d, i) => ({ ...d, id: Date.now() + i })));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-1 w-8 bg-emerald-400 rounded-full" />
            <span className="text-emerald-400 text-sm font-medium tracking-wider uppercase">Trip Planner</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black">
            Build Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Itinerary
            </span>
          </h1>
          <p className="mt-2 text-slate-300 max-w-lg">
            Pick a destination and plan your days — or let AI generate a full itinerary for you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">
        {/* Left: Destination picker */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 sticky top-4">
            <h3 className="font-semibold text-slate-800 mb-3">Choose Destination</h3>
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-3 h-9 text-sm"
            />
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
                {filtered.map((dest) => (
                  <button
                    key={dest.id}
                    onClick={() => handleSelectDest(dest)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center gap-2.5",
                      selectedDest?.id === dest.id
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                        : "hover:bg-slate-50 text-slate-700"
                    )}
                  >
                    <img
                      src={dest.image_url}
                      alt={dest.name}
                      className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{dest.name}</p>
                      <p className="text-xs text-slate-400 truncate">{dest.country_name}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Planner */}
        <div className="flex-1">
          {!selectedDest ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <MapPin className="w-12 h-12 text-slate-200 mb-4" />
              <p className="text-slate-400 text-lg font-medium">Select a destination to start planning</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Trip header */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <img
                    src={selectedDest.image_url}
                    alt={selectedDest.name}
                    className="w-full sm:w-32 h-24 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <Input
                      value={tripTitle}
                      onChange={(e) => setTripTitle(e.target.value)}
                      className="text-lg font-bold border-0 p-0 h-auto focus-visible:ring-0 text-slate-800"
                    />
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm text-slate-400">{selectedDest.country_name}</span>
                      <Badge className="bg-emerald-50 text-emerald-700 text-xs">{selectedDest.category}</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">£{selectedDest.daily_cost}/day · {selectedDest.best_season}</p>
                  </div>
                </div>
              </div>

              {/* AI Generator */}
              <ItineraryAI
                destination={selectedDest}
                onGenerated={handleAIGenerated}
                generating={generating}
                setGenerating={setGenerating}
              />

              {/* Days */}
              <div className="space-y-4">
                <AnimatePresence>
                  {days.map((day) => (
                    <motion.div
                      key={day.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <DayCard
                        day={day}
                        onUpdate={(updated) => updateDay(day.id, updated)}
                        onRemove={() => removeDay(day.id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>

                <Button
                  variant="outline"
                  className="w-full border-dashed border-slate-300 text-slate-500 hover:border-emerald-400 hover:text-emerald-600"
                  onClick={addDay}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Day
                </Button>
              </div>

              {days.length > 0 && (
                <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-emerald-500" />{days.length} days planned</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-500" />{days.reduce((acc, d) => acc + d.activities.length, 0)} activities</span>
                    <span className="text-sm font-semibold text-emerald-700">Est. £{(selectedDest.daily_cost * days.length).toLocaleString()}</span>
                  </div>
                  <ExportButton tripTitle={tripTitle} destination={selectedDest} days={days} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}