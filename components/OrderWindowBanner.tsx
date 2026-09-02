"use client";

import React, { useState, useEffect } from "react";
import { Clock, AlertCircle } from "lucide-react";

export function OrderWindowBanner() {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const currentHour = now.getHours();

      // Active window: 18:00 (6 PM) to 23:00 (11 PM)
      const windowOpen = currentHour >= 18 && currentHour < 23;
      setIsOpen(windowOpen);

      const target = new Date();
      if (windowOpen) {
        // Countdown to 11:00 PM today
        target.setHours(23, 0, 0, 0);
      } else {
        // Countdown to 6:00 PM (today if before 6 PM, or tomorrow if past 11 PM)
        if (currentHour >= 23) {
          target.setDate(target.getDate() + 1);
        }
        target.setHours(18, 0, 0, 0);
      }

      const diff = Math.max(0, target.getTime() - now.getTime());
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!timeLeft) return null;

  return (
    <aside aria-label="Order Window Status" className={`w-full py-2.5 px-4 text-xs sm:text-sm font-medium transition-colors ${
      isOpen ? "bg-emerald-700 text-white" : "bg-slate-900 text-slate-100 border-b border-slate-800"
    }`}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isOpen ? (
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
          ) : (
            <span className="flex h-2 w-2 rounded-full bg-amber-400"></span>
          )}
          <span>
            {isOpen
              ? "🟢 Live Night Window: Overnight catch delivered tomorrow by 6:30 AM – 8:00 AM via Porter."
              : "⚓ Pre-order Preview Mode: Orders open daily between 6:00 PM and 11:00 PM for overnight Kasimedu catch."}
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-mono font-bold tracking-wide bg-black/30 px-3 py-1 rounded-md text-amber-300">
          <Clock className="w-3.5 h-3.5" />
          <span>{isOpen ? "Closes in: " : "Opens in: "}</span>
          <span>
            {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
        </div>
      </div>
    </aside>
  );
}
