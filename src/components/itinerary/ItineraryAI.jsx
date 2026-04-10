import React, { useState } from "react";
import { Sparkles, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchDestinations } from "@/api/destinations";

export default function ItineraryAI({ destination, onGenerated, generating, setGenerating }) {
  const [numDays, setNumDays] = useState(5);
  const [expanded, setExpanded] = useState(true);

  const generate = async () => {
  setGenerating(true);

  const res = await fetch("http://localhost:5000/ai/generate-itinerary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      destination,
      numDays
    })
  });

  const result = await res.json();

  if (result?.days) {
    onGenerated(
      result.days.map((d, i) => ({
        ...d,
        id: Date.now() + i,
        activities: d.activities.map((a, j) => ({
          ...a,
          id: Date.now() + j
        }))
      }))
    );
  }

  setGenerating(false);
  setExpanded(false);
};

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span className="font-semibold text-emerald-800 text-base">AI Itinerary Generator</span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-emerald-500" /> : <ChevronDown className="w-4 h-4 text-emerald-500" />}
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-3">
          <p className="text-xs text-emerald-700">
            Let AI generate a full day-by-day itinerary for {destination.name} based on your interests and budget.
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 font-medium whitespace-nowrap">Number of days</label>
              <Input
                type="number"
                value={numDays}
                onChange={(e) => setNumDays(Math.max(1, Math.min(14, parseInt(e.target.value) || 1)))}
                className="w-16 h-9 text-center"
                min={1}
                max={14}
              />
            </div>
            <Button
              onClick={generate}
              disabled={generating}
              className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1"
            >
              {generating ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" />Generate Itinerary</>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}