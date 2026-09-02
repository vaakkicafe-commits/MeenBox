"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PantryItem, PackSize } from "../data/pantryCatalog";
import { Plus, Sparkles, ShieldCheck, Flame, Utensils } from "lucide-react";

interface PantryCardProps {
  item: PantryItem;
  onAddPantryItem: (item: PantryItem, selectedSize: PackSize) => void;
}

export function PantryCard({ item, onAddPantryItem }: PantryCardProps) {
  const [selectedPack, setSelectedPack] = useState<PackSize>(item.packSizes[0]);

  const isKaruvadu = item.category === "dried_fish";

  return (
    <article className="bg-white rounded-3xl border border-slate-200 hover:border-amber-400 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
      {/* Product Image & Badges */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        <Image
          src={item.image}
          alt={item.nameEnglish}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {item.badge && (
          <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm uppercase tracking-wider">
            {isKaruvadu ? <Sparkles className="w-3 h-3" /> : <Flame className="w-3 h-3 text-red-700" />}
            {item.badge}
          </span>
        )}
        <span className="absolute bottom-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border border-white/10">
          {item.shelfLife}
        </span>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Vernacular & English Title */}
          <div className="flex justify-between items-baseline mb-1">
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              {item.nameEnglish}
            </h3>
            <span className="text-xs font-bold text-amber-700 font-tamil">
              ({item.nameTamil})
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed mb-2 line-clamp-2">
            {item.description}
          </p>

          {/* Culinary Pair Note */}
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl mb-3">
            <Utensils className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate">{item.culinaryUse}</span>
          </div>
        </div>

        <div>
          {/* Pack Size Buttons */}
          <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl mb-3">
            {item.packSizes.map((pack) => (
              <button
                key={pack.unit}
                type="button"
                onClick={() => setSelectedPack(pack)}
                className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all ${
                  selectedPack.unit === pack.unit
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {pack.unit}
              </button>
            ))}
          </div>

          {/* Pricing & Add Action */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">
                {isKaruvadu ? "Vacuum Odor-Free" : "Stone-Ground Tub"}
              </span>
              <p className="text-lg font-black text-slate-900">
                ₹{selectedPack.price.toLocaleString("en-IN")}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onAddPantryItem(item, selectedPack)}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-3.5 py-2.5 rounded-xl shadow-xs active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Box</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
