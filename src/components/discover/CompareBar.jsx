import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitCompare, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CompareBar({ destinations, onRemove, onCompare }) {
  if (destinations.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 inset-x-0 z-40 p-4"
      >
        <div className="max-w-3xl mx-auto bg-slate-800 text-white rounded-2xl shadow-2xl shadow-slate-900/50 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <GitCompare className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div className="flex items-center gap-2">
              {destinations.map((d, i) => (
                <React.Fragment key={d.id}>
                  <div className="flex items-center gap-2 bg-slate-700 rounded-xl px-3 py-1.5">
                    <img src={d.image_url} className="w-6 h-6 rounded-md object-cover" alt={d.name} />
                    <span className="text-base font-medium">{d.name}</span>
                    <button onClick={() => onRemove(d)} className="text-slate-400 hover:text-white transition">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {i === 0 && destinations.length === 2 && (
                    <span className="text-slate-500 text-xs font-bold">VS</span>
                  )}
                </React.Fragment>
              ))}
              {destinations.length === 1 && (
                <span className="text-base text-slate-400">Select one more to compare</span>
              )}
            </div>
          </div>
          <Button
            disabled={destinations.length < 2}
            onClick={onCompare}
            className={cn(
              "bg-emerald-500 hover:bg-emerald-600 text-white gap-2",
              destinations.length < 2 && "opacity-50 cursor-not-allowed"
            )}
          >
            Compare
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}