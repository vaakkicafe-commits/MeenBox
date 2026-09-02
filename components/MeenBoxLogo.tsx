"use client";

import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function MeenBoxLogo({ className = "", size = "md" }: LogoProps) {
  const iconSize = size === "sm" ? 32 : size === "lg" ? 44 : 38;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Funky-Corporate SVG Box + Fish Tail Motif */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform hover:scale-105 duration-200"
        >
          {/* Outer Rounded Isometric-style Box */}
          <rect
            x="4"
            y="6"
            width="40"
            height="36"
            rx="10"
            className="fill-slate-900"
          />
          {/* Top Lid Accent (Cool Cyan / Ocean Wave Tone) */}
          <path
            d="M4 14C4 9.58172 7.58172 6 12 6H36C40.4183 6 44 9.58172 44 14V16H4V14Z"
            className="fill-cyan-400"
          />
          {/* Funky Fish Cutout / Swimming Stream in Middle */}
          <path
            d="M14 26C14 23.5 17.5 21 24 21C30.5 21 34 23.5 34 26C34 28.5 30.5 31 24 31C17.5 31 14 28.5 14 26Z"
            className="fill-emerald-400"
          />
          {/* Fish Tail / Parcel Fin */}
          <path
            d="M15 26L9 21.5V30.5L15 26Z"
            className="fill-emerald-400"
          />
          {/* Eye of the Fish (Corporate Clean Dot) */}
          <circle cx="30" cy="25" r="1.5" className="fill-slate-900" />
          {/* Temperature / Cold Chain Snowflake Spark */}
          <circle cx="38" cy="11" r="2" className="fill-white" />
        </svg>
      </div>

      {/* Brand Wordmark & Corporate Subtitle */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            MEEN<span className="text-cyan-600">BOX</span>
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-widest bg-slate-900 text-white px-1.5 py-0.5 rounded-md border border-slate-800 shadow-xs">
            SUPPLY CO.
          </span>
        </div>
        <span className="text-[11px] font-semibold text-slate-500 tracking-tight">
          Royapuram Wharves • Cold-Chain Morning Logistics
        </span>
      </div>
    </div>
  );
}
