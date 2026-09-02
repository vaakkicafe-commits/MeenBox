"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sliders,
  Save,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Power,
  CheckCircle2,
  AlertCircle,
  Scissors,
  ChevronLeft,
  Truck,
  Lock,
  Unlock,
  KeyRound,
  ImageIcon,
  X,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

interface AdminFishItem {
  id: string;
  nameEnglish: string;
  nameTamil: string;
  image: string;
  price500g: number;
  price1kg: number;
  isAvailable: boolean;
  cleaningFee: number;
}

export default function AdminInventoryPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);

  const [items, setItems] = useState<AdminFishItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Modal for editing image
  const [editingImageItem, setEditingImageItem] = useState<AdminFishItem | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState<string>("");

  // Check admin session on mount
  useEffect(() => {
    const isAuth = sessionStorage.getItem("catch_admin_session") === "authenticated";
    setIsAuthenticated(isAuth);

    fetch("/api/admin/inventory")
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default master PIN is 8899 or password admin123
    if (passcode === "8899" || passcode === "admin123" || passcode === "admin") {
      sessionStorage.setItem("catch_admin_session", "authenticated");
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError("Incorrect Admin PIN. (Default PIN is 8899)");
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem("catch_admin_session");
    setIsAuthenticated(false);
    setPasscode("");
  };

  // Update specific field in state
  const updateItem = (id: string, field: keyof AdminFishItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Toggle availability
  const toggleAvailability = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  // Bulk price adjuster for auction shifts (+5% or -5%)
  const applyBulkShift = (multiplier: number) => {
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        price500g: Math.round((item.price500g * multiplier) / 10) * 10,
        price1kg: Math.round((item.price1kg * multiplier) / 10) * 10,
      }))
    );
    setStatusMessage(
      `Adjusted prices by ${multiplier > 1 ? "+" : ""}${Math.round(
        (multiplier - 1) * 100
      )}% across all items`
    );
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Save changes to database / API
  const saveChanges = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage("Daily catch availability, rates & photos updated live!");
      }
    } catch {
      setStatusMessage("Failed to save changes.");
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  // Open Image Modal
  const openImageModal = (item: AdminFishItem) => {
    setEditingImageItem(item);
    setCustomImageUrl(item.image);
  };

  // Save Image from Modal
  const handleSaveImage = () => {
    if (editingImageItem && customImageUrl.trim()) {
      updateItem(editingImageItem.id, "image", customImageUrl.trim());
      setEditingImageItem(null);
      setStatusMessage(`Updated photo for ${editingImageItem.nameEnglish}. Remember to click 'Save Live Changes'!`);
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  // 1. ADMIN AUTHENTICATION WALL
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans selection:bg-blue-600 selection:text-white">
        <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-14 h-14 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>

          <span className="text-[10px] font-mono font-bold tracking-widest text-blue-400 uppercase bg-blue-950 px-3 py-1 rounded-full border border-blue-800">
            Authorized Personnel Only
          </span>

          <h1 className="text-2xl font-black text-white mt-3">
            Merchant & Admin Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            Enter your 4-digit Master PIN or password to manage daily harbor rates, stock availability, and seafood photos.
          </p>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Master Admin PIN</span>
                <span className="text-[10px] text-slate-500 font-normal">Default PIN: 8899</span>
              </label>
              <div className="relative">
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
              <span>Unlock Merchant Dashboard</span>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  const activeCount = items.filter((i) => i.isAvailable).length;

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 font-sans selection:bg-blue-600 selection:text-white">
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
              href="/admin/cutter-sheet"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors"
            >
              <Scissors className="w-4 h-4" />
              <span>4 AM Cutter Sheet</span>
            </Link>
            <Link
              href="/admin/porter-dispatch"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
            >
              <Truck className="w-4 h-4" />
              <span>Porter Dispatch</span>
            </Link>
            <button
              type="button"
              onClick={handleAdminLogout}
              className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock / Sign Out</span>
            </button>
          </div>
        </div>

        {/* Top Control Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-600" />
              <h1 className="text-xl font-black text-slate-900">
                Daily Harbor Rates, Photos & Stock Control
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Active Catch Tonight: <strong>{activeCount} of {items.length}</strong> fish varieties available.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Multipliers */}
            <button
              type="button"
              onClick={() => applyBulkShift(1.05)}
              className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-3 py-2 rounded-xl text-xs font-bold transition-all"
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-700" />
              +5% Auction Hike
            </button>
            <button
              type="button"
              onClick={() => applyBulkShift(0.95)}
              className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 px-3 py-2 rounded-xl text-xs font-bold transition-all"
            >
              <TrendingDown className="w-3.5 h-3.5 text-emerald-700" />
              -5% Catch Surplus
            </button>

            {/* Save Button */}
            <button
              type="button"
              disabled={saving}
              onClick={saveChanges}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Live Changes"}
            </button>
          </div>
        </div>

        {/* Feedback Toast */}
        {statusMessage && (
          <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl text-xs font-medium flex items-center gap-2 shadow-lg animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Inventory Items Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <span>Fish Variety & Image</span>
            <div className="hidden sm:flex items-center gap-12 mr-6">
              <span>500g Rate</span>
              <span>1kg Rate</span>
              <span>Clean Fee</span>
              <span>Availability</span>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <div
                key={item.id}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  item.isAvailable ? "bg-white hover:bg-slate-50/50" : "bg-slate-50/90 opacity-60"
                }`}
              >
                {/* Visual + Name + Edit Image Trigger */}
                <div className="flex items-center gap-3 w-full sm:w-2/5">
                  <div className="relative group/img shrink-0">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs">
                      <Image
                        src={item.image}
                        alt={item.nameEnglish}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => openImageModal(item)}
                      title="Change Photo URL"
                      className="absolute inset-0 bg-black/60 text-white rounded-2xl opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center text-[9px] font-bold transition-opacity"
                    >
                      <ImageIcon className="w-4 h-4 mb-0.5" />
                      <span>Edit</span>
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-slate-900">{item.nameEnglish}</h3>
                      <span className="text-xs text-blue-600 font-tamil font-semibold">
                        ({item.nameTamil})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-400 font-mono">{item.id}</span>
                      <button
                        type="button"
                        onClick={() => openImageModal(item)}
                        className="text-[10px] text-blue-600 font-bold hover:underline flex items-center gap-0.5"
                      >
                        <ImageIcon className="w-3 h-3" />
                        <span>Change Photo</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pricing & Stock Controls */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-6 w-full sm:w-auto">
                  {/* 500g Rate Input */}
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-500 sm:hidden">500g: ₹</span>
                    <span className="hidden sm:inline text-xs text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      value={item.price500g}
                      onChange={(e) =>
                        updateItem(item.id, "price500g", Number(e.target.value))
                      }
                      className="w-20 px-2.5 py-1.5 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-blue-600 font-mono"
                    />
                  </div>

                  {/* 1kg Rate Input */}
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-500 sm:hidden">1kg: ₹</span>
                    <span className="hidden sm:inline text-xs text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      value={item.price1kg}
                      onChange={(e) =>
                        updateItem(item.id, "price1kg", Number(e.target.value))
                      }
                      className="w-20 px-2.5 py-1.5 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-blue-600 font-mono"
                    />
                  </div>

                  {/* Cleaning Fee Input */}
                  <div className="flex items-center gap-1">
                    <Scissors className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="number"
                      value={item.cleaningFee}
                      onChange={(e) =>
                        updateItem(item.id, "cleaningFee", Number(e.target.value))
                      }
                      className="w-16 px-2 py-1.5 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-blue-600 font-mono"
                    />
                  </div>

                  {/* ON / OFF Availability Toggle */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleAvailability(item.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        item.isAvailable
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{item.isAvailable ? "In Stock" : "Disabled"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Note */}
        <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-200 p-4 rounded-2xl text-xs text-blue-900">
          <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Only authorized administrators can access this console. Rates, stock toggles, and photo URLs updated here immediately synchronize with the customer storefront at 6:00 PM.
          </p>
        </div>
      </div>

      {/* Edit Image Modal */}
      {editingImageItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  Update Photo for {editingImageItem.nameEnglish}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingImageItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Enter any high-resolution image URL (Unsplash, Cloudinary, AWS S3, or local asset path).
            </p>

            {/* Live Image Preview */}
            <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 mb-4">
              {customImageUrl ? (
                <Image
                  src={customImageUrl}
                  alt={editingImageItem.nameEnglish}
                  fill
                  sizes="480px"
                  className="object-cover"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs font-semibold">
                  No image URL provided
                </div>
              )}
            </div>

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-blue-600 focus:bg-white font-mono"
                />
              </div>

              {/* Quick Presets */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                  Or select fresh market presets:
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCustomImageUrl(
                        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80"
                      )
                    }
                    className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                  >
                    Preset 1 (Market Ice)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCustomImageUrl(
                        "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=800&q=80"
                      )
                    }
                    className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                  >
                    Preset 2 (Red Snapper)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCustomImageUrl(
                        "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80"
                      )
                    }
                    className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                  >
                    Preset 3 (Fish Steaks)
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingImageItem(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveImage}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all active:scale-95"
              >
                Apply Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
