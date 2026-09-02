"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FishItem, PrepOption, UNCUT_PREP_OPTION, STANDARD_CLEANING_FEE } from "../data/fishCatalog";
import { Plus, Scissors, Scale, Check } from "lucide-react";

interface FishCardProps {
  fish: FishItem;
  onAddToCart: (
    item: FishItem,
    weight: "500g" | "1kg",
    prep: PrepOption,
    isCut: boolean,
    cleaningFee: number
  ) => void;
}

export function FishCard({ fish, onAddToCart }: FishCardProps) {
  const [selectedWeight, setSelectedWeight] = useState<"500g" | "1kg">("1kg");
  const [needsCutting, setNeedsCutting] = useState<boolean>(true); // ON / OFF state
  const [selectedPrep, setSelectedPrep] = useState<PrepOption>(fish.prepOptions[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const basePrice = selectedWeight === "1kg" ? fish.price1kg : fish.price500g;
  const cleaningFee = needsCutting ? STANDARD_CLEANING_FEE : 0;
  const totalPrice = basePrice + cleaningFee;

  const activePrep = needsCutting ? selectedPrep : UNCUT_PREP_OPTION;
  const baseGrams = selectedWeight === "1kg" ? 1000 : 500;
  const netGrams = Math.round((baseGrams * activePrep.yieldPercent) / 100);

  const handleAdd = () => {
    onAddToCart(fish, selectedWeight, activePrep, needsCutting, cleaningFee);
  };

  return (
    <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group">
      {/* Visual & Badge */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        <Image
          src={fish.image}
          alt={fish.nameEnglish}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {fish.isAvailable === false ? (
          <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
            Out of Tonight's Catch
          </span>
        ) : (
          fish.badge && (
            <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
              {fish.badge}
            </span>
          )
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        {/* Title */}
        <div className="flex justify-between items-baseline mb-1">
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
            {fish.nameEnglish}
          </h2>
          <span className="text-sm font-bold text-blue-700 font-tamil">
            {fish.nameTamil}
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-3">{fish.marketName}</p>

        {/* Weight Selector */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg mb-3">
          <button
            type="button"
            onClick={() => setSelectedWeight("500g")}
            className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
              selectedWeight === "500g"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            500 Grams
          </button>
          <button
            type="button"
            onClick={() => setSelectedWeight("1kg")}
            className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
              selectedWeight === "1kg"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            1 Kilogram
          </button>
        </div>

        {/* CUTTING ON / OFF TOGGLE SWITCH */}
        <div className="border border-slate-200 bg-slate-50 rounded-xl p-2.5 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Scissors
                className={`w-3.5 h-3.5 ${
                  needsCutting ? "text-blue-600" : "text-slate-400"
                }`}
              />
              <span className="text-xs font-bold text-slate-800">
                Harbor Cleaning & Cutting
              </span>
            </div>
            {/* Custom Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={needsCutting}
              onClick={() => setNeedsCutting(!needsCutting)}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                needsCutting ? "bg-blue-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  needsCutting ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex justify-between items-center mt-1 text-[11px]">
            <span className="text-slate-500">
              {needsCutting
                ? `Cleaned & Sliced (+₹${STANDARD_CLEANING_FEE})`
                : "Uncut / Raw as caught (₹0)"}
            </span>
            {needsCutting && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-blue-600 font-bold hover:underline"
              >
                Style: {selectedPrep.name.split(" ")[0]} ▾
              </button>
            )}
          </div>
        </div>

        {/* Yield Transparency Notice */}
        <div className="flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200/60 mb-4 mt-auto">
          <Scale className="w-3.5 h-3.5 shrink-0 text-amber-600" />
          <span>
            {needsCutting ? (
              <>
                Gross {selectedWeight} yields <strong>~{netGrams}g</strong> after gutting/descaling.
              </>
            ) : (
              <>
                Delivered <strong>whole & uncut ({baseGrams}g)</strong> without head/scale removal.
              </>
            )}
          </span>
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {fish.isAvailable === false
                ? "Unavailable Tonight"
                : needsCutting
                ? `Fish ₹${basePrice} + Cut ₹${cleaningFee}`
                : "Whole Uncut"}
            </span>
            <p className="text-lg font-black text-slate-900">₹{totalPrice}</p>
          </div>

          {fish.isAvailable === false ? (
            <button
              type="button"
              disabled
              className="bg-slate-200 text-slate-500 font-bold text-[11px] px-3 py-2.5 rounded-xl cursor-not-allowed"
            >
              Out of Tonight's Catch
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs hover:shadow active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              ADD
            </button>
          )}
        </div>
      </div>

      {/* Cutting Style Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-slate-900 text-base">Select Preparation Cut</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Select how harbor cutters should slice your {fish.nameEnglish}:
            </p>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {fish.prepOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setSelectedPrep(option);
                    setIsModalOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between ${
                    selectedPrep.id === option.id
                      ? "border-blue-600 bg-blue-50/60 ring-1 ring-blue-600"
                      : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                  }`}
                >
                  <div className="pr-2">
                    <p className="text-xs font-bold text-slate-900">{option.name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      {option.description}
                    </p>
                    <span className="inline-block mt-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Cleaning Yield: ~{option.yieldPercent}%
                    </span>
                  </div>
                  {selectedPrep.id === option.id && (
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
