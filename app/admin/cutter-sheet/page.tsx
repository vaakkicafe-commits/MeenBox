"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Anchor, Printer, QrCode, Scissors, Check, Scale, ChevronLeft, Truck, Package, Lock, Unlock, ShieldAlert } from "lucide-react";

interface OrderItemSummary {
  orderId: string;
  customerName: string;
  phone: string;
  fishId: string;
  fishName: string;
  isCut: boolean;
  cutType: string;
  weightGrams: number;
  expectedNet: number;
  packed: boolean;
}

export default function CutterSheetPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const isAuth = sessionStorage.getItem("catch_admin_session") === "authenticated";
    setIsAuthenticated(isAuth);
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "8899" || passcode === "admin123" || passcode === "admin") {
      sessionStorage.setItem("catch_admin_session", "authenticated");
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError("Incorrect Admin PIN. (Default PIN is 8899)");
    }
  };
  const [orders, setOrders] = useState<OrderItemSummary[]>([
    {
      orderId: "KSM-1041",
      customerName: "Rajesh K.",
      phone: "9840123456",
      fishId: "vanjaram",
      fishName: "Vanjaram (Seer Fish)",
      isCut: true,
      cutType: "Fry Slices (Steaks)",
      weightGrams: 1000,
      expectedNet: 820,
      packed: false,
    },
    {
      orderId: "KSM-1042",
      customerName: "Anita S.",
      phone: "9840987654",
      fishId: "vanjaram",
      fishName: "Vanjaram (Seer Fish)",
      isCut: false,
      cutType: "Whole Uncut (முழு மீன்)",
      weightGrams: 1000,
      expectedNet: 1000,
      packed: true,
    },
    {
      orderId: "KSM-1043",
      customerName: "Murugan V.",
      phone: "9840112233",
      fishId: "sankara",
      fishName: "Sankara (Red Snapper)",
      isCut: true,
      cutType: "Curry Cut",
      weightGrams: 1000,
      expectedNet: 750,
      packed: false,
    },
    {
      orderId: "KSM-1044",
      customerName: "Priya D.",
      phone: "9840445566",
      fishId: "vavval-white",
      fishName: "White Pomfret (Vavval)",
      isCut: true,
      cutType: "Tawa Fry Steaks",
      weightGrams: 1000,
      expectedNet: 820,
      packed: false,
    },
    {
      orderId: "KSM-1045",
      customerName: "Karthik R.",
      phone: "9840778899",
      fishId: "eral",
      fishName: "Sea Prawns (Eral)",
      isCut: true,
      cutType: "Peeled & Deveined",
      weightGrams: 500,
      expectedNet: 250,
      packed: false,
    },
    {
      orderId: "KSM-1046",
      customerName: "Sundaram M.",
      phone: "9840881122",
      fishId: "mathi",
      fishName: "Mathi (Sardine)",
      isCut: false,
      cutType: "Whole Uncut (முழு மீன்)",
      weightGrams: 1000,
      expectedNet: 1000,
      packed: false,
    },
  ]);

  // Group auction purchase requirements (total gross weight to buy at 4:00 AM auction)
  const procurementSummary = orders.reduce((acc, curr) => {
    acc[curr.fishName] = (acc[curr.fishName] || 0) + curr.weightGrams;
    return acc;
  }, {} as Record<string, number>);

  const togglePacked = (index: number) => {
    setOrders((prev) =>
      prev.map((o, i) => (i === index ? { ...o, packed: !o.packed } : o))
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans selection:bg-blue-600 selection:text-white">
        <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-14 h-14 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>

          <span className="text-[10px] font-mono font-bold tracking-widest text-blue-400 uppercase bg-blue-950 px-3 py-1 rounded-full border border-blue-800">
            Harbor Operations Only
          </span>

          <h1 className="text-2xl font-black text-white mt-3">
            4:00 AM Cutter Sheet
          </h1>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            Enter your Master Admin PIN to view procurement buy quantities and cutting block allocations.
          </p>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Master Admin PIN</span>
                <span className="text-[10px] text-slate-500 font-normal">Default PIN: 8899</span>
              </label>
              <input
                type="password"
                placeholder="Enter 4-digit PIN (e.g. 8899)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full text-center text-lg tracking-widest font-mono font-bold py-3 bg-slate-900 border border-slate-700 text-white rounded-2xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                autoFocus
                required
              />
            </div>

            {authError && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3.5 rounded-2xl shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Cutter Console</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-700/60">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Customer Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 transition-colors shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Customer Storefront</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/porter-dispatch"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors"
            >
              <Truck className="w-4 h-4" />
              <span>Porter Dispatch Board &rarr;</span>
            </Link>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Anchor className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-black text-slate-900">
                4:00 AM Harbor Procurement & Cutting Sheet
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Aggregated overnight customer pre-orders for Kasimedu Auction Landing Hall #2
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
          >
            <Printer className="w-4 h-4" />
            Print Thermal Cutting Labels
          </button>
        </div>

        {/* Procurement Auction Buy Targets */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Scale className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-800">
              Total Auction Purchase Requirement (Whole Fish)
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {Object.entries(procurementSummary).map(([fish, grams]) => (
              <div key={fish} className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
                <span className="text-xs font-semibold text-slate-500 block truncate">{fish}</span>
                <span className="text-lg font-black text-slate-900 mt-1 block">
                  {(grams / 1000).toFixed(1)} KG
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Individual Cutter Station Orders */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-800">
                Cutter & Packing Line ({orders.filter((o) => o.packed).length}/{orders.length} Boxed)
              </h2>
            </div>
            <span className="text-[11px] font-bold text-slate-500">
              Whole uncut orders bypass cutting block
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {orders.map((item, idx) => (
              <div
                key={item.orderId}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  item.packed ? "bg-emerald-50/40" : "hover:bg-slate-50"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-slate-200 px-2.5 py-0.5 rounded-lg text-slate-800">
                      {item.orderId}
                    </span>
                    <span className="text-sm font-bold text-slate-900">{item.customerName}</span>
                    <span className="text-xs text-slate-400 font-mono">({item.phone})</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-blue-600">{item.fishName}</span>
                    <span className="text-slate-300">•</span>
                    {item.isCut ? (
                      <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md text-[11px] flex items-center gap-1">
                        <Scissors className="w-3 h-3 text-amber-700" />
                        {item.cutType}
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-md text-[11px] flex items-center gap-1">
                        <Package className="w-3 h-3 text-emerald-700" />
                        PACK WHOLE AS-IS (முழு மீன்)
                      </span>
                    )}
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600 font-medium">
                      {item.isCut ? (
                        <>
                          Gross: <strong>{item.weightGrams}g</strong> &rarr; Cleaned Yield: ~<strong>{item.expectedNet}g</strong>
                        </>
                      ) : (
                        <>
                          Net Weight: <strong>{item.weightGrams}g</strong> (100% Raw Whole)
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-lg">
                    <QrCode className="w-3.5 h-3.5 text-slate-600" />
                    <span>Scan & Pack</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => togglePacked(idx)}
                    className={`flex items-center gap-1 text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs ${
                      item.packed
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    {item.packed ? "Packed in Ice Box" : "Mark Packed"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
