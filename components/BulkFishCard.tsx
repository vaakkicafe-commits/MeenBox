"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FishItem } from "../data/fishCatalog";
import { Plus, Building2, Layers, Check, Scale } from "lucide-react";

interface BulkFishCardProps {
  fish: FishItem;
  onAddBulk: (item: FishItem, weightKg: number, unitRate: number, cutType: string) => void;
}

export function BulkFishCard({ fish, onAddBulk }: BulkFishCardProps) {
  const [selectedWeightKg, setSelectedWeightKg] = useState<number>(10);
  const [bulkCut, setBulkCut] = useState<string>("Commercial Curry Cut");

  // Determine bulk rate (wholesale discount ~18% off 1kg retail rate)
  const bulkPricePerKg = Math.round(fish.price1kg * 0.82);
  const grandTotal = Math.round(bulkPricePerKg * selectedWeightKg);

  return (
    <article className="bg-white rounded-3xl border-2 border-slate-200 hover:border-emerald-500 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      {/* Visual & Wholesale Badge */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        <Image
          src={fish.image}
          alt={fish.nameEnglish}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 bg-emerald-700 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm uppercase tracking-wider">
          <Building2 className="w-3.5 h-3.5 text-emerald-300" />
          Wholesale Crate Rate
        </span>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {/* Vernacular & English Title */}
        <div className="flex justify-between items-baseline mb-1">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            {fish.nameEnglish}
          </h3>
          <span className="text-xs font-bold text-blue-700 font-tamil">
            ({fish.nameTamil})
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-3">Kasimedu Direct Commercial Kitchen Grade</p>

        {/* Crate Size Segmented Switch */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl mb-3">
          {[5, 10, 25].map((kg) => (
            <button
              key={kg}
              type="button"
              onClick={() => setSelectedWeightKg(kg)}
              className={`py-2 text-xs font-black rounded-lg transition-all ${
                selectedWeightKg === kg
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {kg} KG Crate
            </button>
          ))}
        </div>

        {/* Bulk Cutting Style Selector */}
        <div className="space-y-1.5 mb-4">
          <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            Kitchen Prep Specification
          </label>
          <select
            value={bulkCut}
            onChange={(e) => setBulkCut(e.target.value)}
            className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-emerald-600"
          >
            <option value="Commercial Curry Cut">Commercial Curry Cut (Standard Hotel Chunks)</option>
            <option value="Tawa Fry Steaks">Uniform Sliced Steaks (Tawa / Meals Fry)</option>
            <option value="Biryani Boneless Chunks">Boneless Cubes (Dum Biryani / Meals Special)</option>
            <option value="Whole Uncut on Flake Ice">Whole Uncut (In 15kg Crushed Ice Crate)</option>
          </select>
        </div>

        {/* Pricing Summary & Add Crate */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
          <div>
            <span className="text-[10px] text-slate-400 font-mono block">
              ₹{bulkPricePerKg}/KG wholesale
            </span>
            <p className="text-lg font-black text-slate-900">
              ₹{grandTotal.toLocaleString("en-IN")}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onAddBulk(fish, selectedWeightKg, bulkPricePerKg, bulkCut)}
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Crate
          </button>
        </div>
      </div>
    </article>
  );
}
