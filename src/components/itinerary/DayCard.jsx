import React, { useState } from "react";
import { Trash2, Plus, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DayCard({ day, onUpdate, onRemove }) {
  const [newActivity, setNewActivity] = useState("");

  const addActivity = () => {
    if (!newActivity.trim()) return;
    onUpdate({ activities: [...day.activities, { id: Date.now(), text: newActivity.trim(), time: "" }] });
    setNewActivity("");
  };

  const removeActivity = (id) => {
    onUpdate({ activities: day.activities.filter((a) => a.id !== id) });
  };

  const updateActivity = (id, field, value) => {
    onUpdate({ activities: day.activities.map((a) => a.id === id ? { ...a, [field]: value } : a) });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      {/* Day header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
        <Input
          value={day.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          className="font-semibold text-slate-800 border-0 bg-transparent p-0 h-auto focus-visible:ring-0 w-auto"
        />
        <Button variant="ghost" size="icon" className="w-7 h-7 text-slate-400 hover:text-red-500" onClick={onRemove}>
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Activities */}
      <div className="p-4 space-y-2">
        {day.activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-2 group">
            <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
            <Input
              value={activity.time}
              onChange={(e) => updateActivity(activity.id, "time", e.target.value)}
              placeholder="9:00"
              className="w-16 h-8 text-xs text-center border-slate-200"
            />
            <Input
              value={activity.text}
              onChange={(e) => updateActivity(activity.id, "text", e.target.value)}
              className="flex-1 h-8 text-sm border-slate-200"
            />
            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500"
              onClick={() => removeActivity(activity.id)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ))}

        {/* Add activity */}
        <div className="flex gap-2 pt-1">
          <Input
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
            placeholder="Add activity..."
            className="flex-1 h-8 text-sm border-dashed border-slate-300"
            onKeyDown={(e) => e.key === "Enter" && addActivity()}
          />
          <Button size="sm" variant="outline" onClick={addActivity} className="h-8 px-3">
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}