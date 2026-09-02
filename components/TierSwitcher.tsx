"use client";

import React from "react";
import { UtensilsCrossed, Home } from "lucide-react";

interface TierSwitcherProps {
  currentTier: "retail" | "b2b";
  onSelectTier: (tier: "retail" | "b2b") => void;
}

export function TierSwitcher({ currentTier, onSelectTier }: TierSwitcherProps) {
  return (
    <div className="bg-slate-900/90 backdrop-blur-xs p-1 rounded-2xl flex items-center gap-1 border border-slate-700 shadow-inner">
      <button
        type="button"
        onClick={() => onSelectTier("retail")}
        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all ${
          currentTier === "retail"
            ? "bg-blue-600 text-white shadow-md"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <Home className="w-4 h-4" />
        <span>Home Kitchen</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectTier("b2b")}
        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all ${
          currentTier === "b2b"
            ? "bg-emerald-600 text-white shadow-md"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <UtensilsCrossed className="w-4 h-4 text-emerald-300" />
        <span>Hotel & Bulk Catering (Wholesale)</span>
      </button>
    </div>
  );
}
