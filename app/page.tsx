"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OrderWindowBanner } from "../components/OrderWindowBanner";
import { FishCard } from "../components/FishCard";
import { BulkFishCard } from "../components/BulkFishCard";
import { PantryCard } from "../components/PantryCard";
import { TierSwitcher } from "../components/TierSwitcher";
import { CartDrawer } from "../components/CartDrawer";
import { AuthModal, AuthUser } from "../components/AuthModal";
import { MeenBoxLogo } from "../components/MeenBoxLogo";
import { TrustGuaranteeBanner } from "../components/TrustGuaranteeBanner";
import { TrustCommentSection } from "../components/TrustCommentSection";
import { FISH_CATALOG, FishItem, PrepOption } from "../data/fishCatalog";
import { PANTRY_CATALOG, PantryItem, PackSize } from "../data/pantryCatalog";
import { CartItem } from "../types/order";
import Link from "next/link";
import {
  ShoppingBag,
  User,
  Search,
  Sparkles,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  Sliders,
  Building2,
  UtensilsCrossed,
  Lock,
  Flame,
  Sun,
  Layers,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [currentTier, setCurrentTier] = useState<"retail" | "b2b">("retail");
  const [activeCatalogTab, setActiveCatalogTab] = useState<"fresh" | "karuvadu" | "masala">("fresh");
  const [fishList, setFishList] = useState<FishItem[]>(FISH_CATALOG);
  const [pantryList] = useState<PantryItem[]>(PANTRY_CATALOG);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [recentOrderModal, setRecentOrderModal] = useState<{ orderId: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("catch_user");
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }

    // Load live daily rates & stock availability from inventory API
    fetch("/api/admin/inventory")
      .then((res) => res.json())
      .then((data) => {
        if (data.items && Array.isArray(data.items)) {
          setFishList((prev) =>
            prev.map((originalFish) => {
              const liveData = data.items.find((i: any) => i.id === originalFish.id);
              if (liveData) {
                return {
                  ...originalFish,
                  price500g: liveData.price500g,
                  price1kg: liveData.price1kg,
                  isAvailable: liveData.isAvailable,
                  cleaningFee: liveData.cleaningFee,
                  image: liveData.image || originalFish.image,
                };
              }
              return originalFish;
            })
          );
        }
      })
      .catch((e) => console.error("Inventory fetch error:", e));
  }, []);

  // Retail Fresh Fish Add to Cart
  const handleAddToCart = (
    fish: FishItem,
    weight: "500g" | "1kg",
    prep: PrepOption,
    isCut: boolean,
    cleaningFee: number
  ) => {
    const itemKey = `${fish.id}-${weight}-${prep.id}-${isCut ? "cut" : "uncut"}`;
    const basePrice = weight === "1kg" ? fish.price1kg : fish.price500g;
    const finalUnitPrice = basePrice + cleaningFee;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === itemKey);
      if (existing) {
        return prev.map((item) =>
          item.id === itemKey ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: itemKey,
          fish,
          weight,
          prep,
          isCut,
          basePrice,
          cleaningFee,
          unitPrice: finalUnitPrice,
          quantity: 1,
        },
      ];
    });

    setIsCartOpen(true);
  };

  // Wholesale Crate Add to Cart
  const handleAddBulkCrate = (
    fish: FishItem,
    weightKg: number,
    unitRate: number,
    cutType: string
  ) => {
    const itemKey = `b2b-${fish.id}-${weightKg}kg-${cutType}`;
    const totalPrice = Math.round(unitRate * weightKg);

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === itemKey);
      if (existing) {
        return prev.map((item) =>
          item.id === itemKey ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: itemKey,
          fish,
          weight: `${weightKg} KG Crate`,
          prep: {
            id: `b2b-${cutType}`,
            name: cutType,
            description: "Commercial kitchen preparation",
            yieldPercent: cutType.includes("Whole") ? 100 : 80,
            cleaningFee: 0,
          },
          isCut: !cutType.includes("Whole"),
          basePrice: totalPrice,
          cleaningFee: 0,
          unitPrice: totalPrice,
          quantity: 1,
          isBulkCrate: true,
          crateKg: weightKg,
        },
      ];
    });

    setIsCartOpen(true);
  };

  // Ambient Pantry Add to Cart (Karuvadu & Masalas)
  const handleAddPantryItem = (item: PantryItem, selectedSize: PackSize) => {
    const itemKey = `pantry-${item.id}-${selectedSize.unit}`;

    // Synthetic fish item wrapper for uniform CartItem structure
    const syntheticFish: FishItem = {
      id: item.id,
      nameEnglish: item.nameEnglish,
      nameTamil: item.nameTamil,
      marketName: item.category === "dried_fish" ? "Sun-Dried Seafood" : "Fresh-Ground Spice",
      image: item.image,
      price500g: selectedSize.price,
      price1kg: selectedSize.price,
      prepOptions: [],
    };

    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === itemKey);
      if (existing) {
        return prev.map((i) =>
          i.id === itemKey ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: itemKey,
          fish: syntheticFish,
          weight: selectedSize.unit,
          prep: {
            id: "ambient-pack",
            name: item.category === "dried_fish" ? "Vacuum-Sealed Pouch" : "Airtight Spice Tub",
            description: "Packs directly into dry pocket of your morning MeenBox",
            yieldPercent: 100,
            cleaningFee: 0,
          },
          isCut: false,
          basePrice: selectedSize.price,
          cleaningFee: 0,
          unitPrice: selectedSize.price,
          quantity: 1,
        },
      ];
    });

    setIsCartOpen(true);
  };

  // 1-Click Cross-Sell Add
  const handleAddCrossSellItem = (crossSell: {
    id: string;
    name: string;
    tamilName: string;
    weight: string;
    price: number;
    image: string;
  }) => {
    const itemKey = `cross-sell-${crossSell.id}`;
    const syntheticFish: FishItem = {
      id: crossSell.id,
      nameEnglish: crossSell.name,
      nameTamil: crossSell.tamilName,
      marketName: "Ambient Cross-Sell",
      image: crossSell.image,
      price500g: crossSell.price,
      price1kg: crossSell.price,
      prepOptions: [],
    };

    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === itemKey);
      if (existing) {
        return prev.map((i) =>
          i.id === itemKey ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: itemKey,
          fish: syntheticFish,
          weight: crossSell.weight,
          prep: {
            id: "dry-tote-pack",
            name: "Dry Tote Pack",
            description: "Direct cross-sell pack",
            yieldPercent: 100,
            cleaningFee: 0,
          },
          isCut: false,
          basePrice: crossSell.price,
          cleaningFee: 0,
          unitPrice: crossSell.price,
          quantity: 1,
        },
      ];
    });
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckoutSuccess = (orderId: string) => {
    setIsCartOpen(false);
    setCartItems([]);
    setRecentOrderModal({ orderId });
  };

  const totalCartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  // Filter items from dynamic inventory
  const filteredFish = fishList.filter((fish) => {
    const matchesSearch =
      fish.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fish.nameTamil.includes(searchQuery) ||
      fish.marketName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeCategory === "all") return true;
    if (activeCategory === "popular")
      return (
        fish.badge?.toLowerCase().includes("popular") ||
        fish.badge?.toLowerCase().includes("catch")
      );
    if (activeCategory === "fry")
      return fish.prepOptions.some(
        (p) =>
          p.name.toLowerCase().includes("fry") || p.name.toLowerCase().includes("steak")
      );
    if (activeCategory === "curry")
      return fish.prepOptions.some((p) => p.name.toLowerCase().includes("curry"));
    if (activeCategory === "prawns") return fish.id === "eral";
    return true;
  });

  // Filter Karuvadu & Masalas
  const filteredKaruvadu = pantryList.filter(
    (item) =>
      item.category === "dried_fish" &&
      (item.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nameTamil.includes(searchQuery))
  );

  const filteredMasalas = pantryList.filter(
    (item) =>
      item.category !== "dried_fish" &&
      (item.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nameTamil.includes(searchQuery))
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Countdown Banner */}
      <OrderWindowBanner />

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          {/* Corporate-Funky Logo */}
          <MeenBoxLogo size="md" />

          {/* Dual Mode Switcher (Desktop Header) */}
          <div className="hidden md:block">
            <TierSwitcher currentTier={currentTier} onSelectTier={setCurrentTier} />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Auth state button */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-800 border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-cyan-400 flex items-center justify-center text-[11px] font-black">
                  {currentUser.name[0].toUpperCase()}
                </div>
                <span className="hidden sm:inline font-bold">{currentUser.name}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-cyan-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors border border-slate-200"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline">Sign In (Google / OTP)</span>
              </button>
            )}

            {/* Cart Trigger */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-slate-900 hover:bg-black px-4 py-2.5 rounded-xl text-white font-bold text-xs shadow-sm transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
              <span>MeenBox Order</span>
              {totalCartCount > 0 && (
                <span className="bg-cyan-500 text-slate-950 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Value Proposition + Global Tier Switcher */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-950 to-blue-950 text-white py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Top Tier Switcher Banner for Mobile */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/10 md:hidden">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-cyan-400 block">
                Select Order Mode
              </span>
              <p className="text-xs text-slate-300 mt-0.5">
                Switch between household packs and hotel crates
              </p>
            </div>
            <TierSwitcher currentTier={currentTier} onSelectTier={setCurrentTier} />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 px-3 py-1 rounded-full text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {currentTier === "b2b"
                    ? "Wholesale Auction Slabs • 5kg–50kg Crushed Ice Crates"
                    : "Zero-Storage Catch + Sun-Dried Essentials & Fresh Masalas"}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                {currentTier === "b2b"
                  ? "MeenBox B2B Supply for Hotels & Caterers"
                  : "Tonight's Kasimedu Auction Catch, Delivered Fresh by 7:30 AM"}
              </h1>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                {currentTier === "b2b"
                  ? "Order 5kg, 10kg, or 25kg commercial kitchen crates at wholesale auction rates. Delivered early between 5:30 AM – 7:00 AM via Porter Tata Ace / 3-Wheelers on crushed flake ice with B2B GST tax invoices."
                  : "Order before 11:00 PM tonight. We bid at the 4:00 AM harbor boat landings, clean to your custom cut, and pack with ambient Karuvadu & stone-ground masalas."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
                <Clock className="w-5 h-5 text-amber-300 mb-1" />
                <p className="text-xs font-bold">11:00 PM Cutoff</p>
                <p className="text-[11px] text-slate-300">
                  {currentTier === "b2b" ? "Daily kitchen supply reservation" : "Strict night pre-order window"}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
                <Truck className="w-5 h-5 text-emerald-400 mb-1" />
                <p className="text-xs font-bold">
                  {currentTier === "b2b" ? "5:30 AM – 7:00 AM" : "6:30 AM – 8:00 AM"}
                </p>
                <p className="text-[11px] text-slate-300">
                  {currentTier === "b2b" ? "Tata Ace / 3-Wheeler Crate Dispatch" : "Porter bike / Hub pickup"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Tabs & Search Bar */}
      <section className="max-w-6xl w-full mx-auto px-4 -mt-6">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-3 sm:p-4 space-y-3">
          {/* Main Top Catalog Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveCatalogTab("fresh")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
                  activeCatalogTab === "fresh"
                    ? "bg-slate-900 text-cyan-400 shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Tonight's Fresh Catch (12)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCatalogTab("karuvadu")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
                  activeCatalogTab === "karuvadu"
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Karuvadu / Sun-Dried (6)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCatalogTab("masala")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
                  activeCatalogTab === "masala"
                    ? "bg-rose-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Flame className="w-4 h-4" />
                <span>Fresh Masalas & Pastes (4)</span>
              </button>
            </div>

            {/* Search bar */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search fish, karuvadu, paste..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Sub-Categories for Fresh Catch */}
          {activeCatalogTab === "fresh" && (
            <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1">
              {[
                { id: "all", label: "All 12 Fresh Varieties" },
                { id: "popular", label: "⭐ Popular Catch" },
                { id: "fry", label: "🍳 Fry Cuts" },
                { id: "curry", label: "🍲 Curry Specials" },
                { id: "prawns", label: "🦐 Prawns" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? "bg-cyan-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Catalog Grid */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {/* Zero-Risk Trust & 8:30 AM Refund Guarantee Banner */}
        <TrustGuaranteeBanner />

        {/* 1. FRESH FISH CATALOG */}
        {activeCatalogTab === "fresh" && (
          <div>
            <div className="flex justify-between items-baseline mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    {currentTier === "b2b"
                      ? `Commercial Wholesale Crates (${filteredFish.length} Varieties)`
                      : `Available Daily Varieties (${filteredFish.length})`}
                  </h2>
                  {currentTier === "b2b" && (
                    <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300">
                      Wholesale Slabs (-18%)
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentTier === "b2b"
                    ? "Select 5kg, 10kg, or 25kg commercial crates with kitchen-ready slicing specifications."
                    : "Select weight and custom cutting style for overnight harbor batch processing."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFish.map((fish) =>
                currentTier === "b2b" ? (
                  <BulkFishCard
                    key={fish.id}
                    fish={fish}
                    onAddBulk={handleAddBulkCrate}
                  />
                ) : (
                  <FishCard key={fish.id} fish={fish} onAddToCart={handleAddToCart} />
                )
              )}
            </div>
          </div>
        )}

        {/* 2. KARUVADU (SUN-DRIED SEAFOOD) */}
        {activeCatalogTab === "karuvadu" && (
          <div>
            <div className="flex justify-between items-baseline mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    Royapuram Sun-Dried Selection ({filteredKaruvadu.length})
                  </h2>
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-300">
                    Vacuum Odor-Free
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Naturally sun-dried with sea salt on coastal racks. Packed in airtight dry pouches.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredKaruvadu.map((item) => (
                <PantryCard
                  key={item.id}
                  item={item}
                  onAddPantryItem={handleAddPantryItem}
                />
              ))}
            </div>
          </div>
        )}

        {/* 3. FRESH STONE-GROUND MASALAS */}
        {activeCatalogTab === "masala" && (
          <div>
            <div className="flex justify-between items-baseline mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    Fresh Stone-Ground Masalas & Pastes ({filteredMasalas.length})
                  </h2>
                  <span className="bg-rose-100 text-rose-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-rose-300">
                    No Preservatives
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Stone-ground marinades with Byadgi chilli & wild tamarind. Ready-to-cook with fresh seafood.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredMasalas.map((item) => (
                <PantryCard
                  key={item.id}
                  item={item}
                  onAddPantryItem={handleAddPantryItem}
                />
              ))}
            </div>
          </div>
        )}

        {/* Verified Buyer Reviews & Community Q&A */}
        <TrustCommentSection />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <MeenBoxLogo size="sm" className="[&_span]:text-white [&_span.text-slate-500]:text-slate-400" />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right">
            <p className="text-[11px] text-slate-500">
              Harbor Landing Hub #4, Kasimedu, Chennai 600013. B2B Logistics via Porter.
            </p>
            <Link
              href="/admin/inventory"
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Merchant Admin (Passcode)</span>
            </Link>
          </div>
        </div>
      </footer>

      {/* Cart Drawer with 1-Click Cross-Sell */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveItem}
        onCheckoutSuccess={handleCheckoutSuccess}
        onAddCrossSellItem={handleAddCrossSellItem}
        currentUser={currentUser}
        tier={currentTier}
      />

      {/* Auth Modal (Dual Google + OTP) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />

      {/* Order Confirmation Modal */}
      {recentOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-mono font-bold text-cyan-700 uppercase tracking-widest bg-cyan-50 px-2.5 py-1 rounded-full">
              Order #{recentOrderModal.orderId}
            </span>

            <h3 className="text-xl font-extrabold text-slate-900 mt-2">
              {currentTier === "b2b" ? "B2B Wholesale Pre-Order Placed!" : "MeenBox Order Placed!"}
            </h3>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              We have sent confirmation to your WhatsApp number. Our harbor team will bid for your catch at <strong>4:00 AM</strong>.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 my-4 text-left text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Truck className="w-4 h-4 text-cyan-600" />
                <span>
                  {currentTier === "b2b"
                    ? "Kitchen Delivery Slot: 5:30 AM – 7:00 AM"
                    : "Morning Porter Dispatch: 6:30 AM"}
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                {currentTier === "b2b"
                  ? "Crushed ice crates allocated to commercial transport with GST tax invoice."
                  : "Track the procurement, cleaning, and live Porter driver location in real time."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push(`/track/${recentOrderModal.orderId}`)}
              className="w-full bg-slate-900 hover:bg-black text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>View Live Morning Tracking Screen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
