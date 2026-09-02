"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Trash2,
  ShieldCheck,
  MapPin,
  Truck,
  Store,
  Phone,
  ChevronRight,
  Building2,
  FileText,
  AlertTriangle,
  Flame,
  Sparkles,
  Plus,
} from "lucide-react";
import { CartItem } from "../types/order";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onCheckoutSuccess: (orderId: string) => void;
  onAddCrossSellItem?: (crossSell: {
    id: string;
    name: string;
    tamilName: string;
    weight: string;
    price: number;
    image: string;
  }) => void;
  currentUser?: { name: string; phone: string } | null;
  tier?: "retail" | "b2b";
}

const QUICK_CROSS_SELLS = [
  {
    id: "madras-tawa-fry-paste",
    name: "Madras Tawa Fish Fry Paste",
    tamilName: "மெட்ராஸ் வறுவல் மசாலா",
    weight: "200g Tub",
    price: 69,
    tag: "Stone-Ground Wet Marinade",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "royapuram-kuzhambu-paste",
    name: "Royapuram Meen Kuzhambu Paste",
    tamilName: "மீன் குழம்பு பேஸ்ட்",
    weight: "200g Tub",
    price: 89,
    tag: "Wild Tamarind Base",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "nethili-karuvadu",
    name: "Nethili Karuvadu (Anchovy)",
    tamilName: "நெத்திலி கருவாடு",
    weight: "250g Pouch",
    price: 150,
    tag: "Vacuum Odor-Free",
    image: "https://images.unsplash.com/photo-1579631542720-3a87824fff86?auto=format&fit=crop&w=200&q=80",
  },
];

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onCheckoutSuccess,
  onAddCrossSellItem,
  currentUser,
  tier = "retail",
}: CartDrawerProps) {
  // Fulfillment state
  const [deliveryMode, setDeliveryMode] = useState<"porter" | "pickup">("porter");
  const [customerName, setCustomerName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [gstin, setGstin] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [contingency, setContingency] = useState<"substitute" | "refund">("substitute");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setCustomerName(currentUser.name);
      if (currentUser.phone) setPhone(currentUser.phone);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const isB2B = tier === "b2b";

  // Calculate total kilograms in basket
  const totalWeightKg = items.reduce((acc, item) => {
    if (item.crateKg) return acc + item.crateKg * item.quantity;
    if (item.weight.includes("1kg")) return acc + 1 * item.quantity;
    if (item.weight.includes("500g")) return acc + 0.5 * item.quantity;
    if (item.weight.includes("250g")) return acc + 0.25 * item.quantity;
    if (item.weight.includes("200g")) return acc + 0.2 * item.quantity;
    const num = parseFloat(item.weight);
    return acc + (isNaN(num) ? 0.5 : num) * item.quantity;
  }, 0);

  // Large commercial orders over 30kg get Porter 3-Wheeler / Tata Ace
  const needsCommercialTruck = totalWeightKg >= 30;

  const fishSubtotal = items.reduce((acc, item) => acc + item.basePrice * item.quantity, 0);
  const totalCleaningFee = items.reduce(
    (acc, item) => acc + (item.cleaningFee || 0) * item.quantity,
    0
  );
  const packagingCharge = items.length > 0 ? (isB2B ? 80 : 30) : 0; // Flake ice plastic crates vs thermocol box

  // Delivery charge calculation
  let porterDeliveryCharge = 0;
  if (deliveryMode === "porter" && items.length > 0) {
    porterDeliveryCharge = isB2B ? (needsCommercialTruck ? 180 : 80) : 60;
  }

  const grandTotal = fishSubtotal + totalCleaningFee + packagingCharge + porterDeliveryCharge;

  // Minimum Order Value check for B2B Wholesale
  const b2bMinMet = !isB2B || grandTotal >= 2500;

  // Filter cross-sells to show only ones not yet in cart
  const availableCrossSells = QUICK_CROSS_SELLS.filter(
    (cs) => !items.some((item) => item.id.includes(cs.id))
  );

  const handlePayment = async () => {
    if (!phone || phone.length < 10) {
      alert("Please enter a valid 10-digit WhatsApp phone number to receive morning live tracking!");
      return;
    }
    if (deliveryMode === "porter" && (!address || !pincode)) {
      alert("Please provide complete delivery address and 6-digit pincode for morning Porter delivery.");
      return;
    }
    if (isB2B && !b2bMinMet) {
      alert("Minimum Order Value for Hotel / B2B Wholesale is ₹2,500.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier,
          customerName: customerName || (isB2B ? "Hotel Manager" : "Customer"),
          restaurantName: isB2B ? restaurantName : undefined,
          gstin: isB2B ? gstin : undefined,
          phone,
          deliveryMode,
          address: deliveryMode === "porter" ? { address, pincode } : null,
          items,
          itemTotal: fishSubtotal + totalCleaningFee,
          packagingCharge,
          porterDeliveryCharge,
          grandTotal,
          contingency,
          vehicleAllocation: needsCommercialTruck
            ? "porter_3wheeler_tata_ace"
            : "porter_bike",
          deliverySlot: isB2B ? "5:30 AM – 7:00 AM (Commercial Kitchen)" : "6:30 AM – 8:00 AM",
        }),
      });

      const data = await res.json();
      if (data.success && data.orderId) {
        onCheckoutSuccess(data.orderId);
      } else {
        const demoOrderId = "KSM-" + Math.floor(100000 + Math.random() * 900000);
        onCheckoutSuccess(demoOrderId);
      }
    } catch {
      const demoOrderId = "KSM-" + Math.floor(100000 + Math.random() * 900000);
      onCheckoutSuccess(demoOrderId);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-extrabold text-slate-900">Your MeenBox Order</h2>
              {isB2B && (
                <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  B2B Wholesale
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              {isB2B
                ? `Commercial Supply • Total ${totalWeightKg.toFixed(1)} KG`
                : "Overnight harbor auction & ambient essentials"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Order Items */}
          {items.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-sm font-semibold">Your MeenBox is empty.</p>
              <p className="text-xs mt-1">
                {isB2B
                  ? "Add 5kg, 10kg, or 25kg commercial crates."
                  : "Select fresh seafood, Karuvadu, or stone-ground masalas."}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl"
                >
                  <div className="flex-1 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-slate-900">
                        {item.fish.nameEnglish}
                      </span>
                      <span className="text-xs text-blue-700 font-tamil font-semibold">
                        ({item.fish.nameTamil})
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium mt-0.5">
                      <span className="font-bold text-emerald-700">{item.weight}</span> •{" "}
                      <span className="text-slate-800">{item.prep.name}</span>
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span>Rate: ₹{item.unitPrice}</span>
                      {item.isCut && item.cleaningFee > 0 && (
                        <span className="text-blue-700 font-semibold">
                          (Includes prep)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="text-xs font-black text-slate-900">
                      ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {items.length > 0 && (
            <>
              {/* 1-CLICK AMBIENT PANTRY CROSS-SELL ENGINE */}
              {availableCrossSells.length > 0 && onAddCrossSellItem && (
                <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-600" />
                      Add to Tomorrow's MeenBox
                    </span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full">
                      Packs in dry tote
                    </span>
                  </div>

                  <div className="space-y-2">
                    {availableCrossSells.slice(0, 2).map((cs) => (
                      <div
                        key={cs.id}
                        className="flex items-center justify-between bg-white border border-amber-200 rounded-xl p-2.5 shadow-2xs"
                      >
                        <div className="flex-1 pr-2">
                          <p className="text-xs font-bold text-slate-900 leading-tight">
                            {cs.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-amber-800 font-medium">
                              {cs.weight}
                            </span>
                            <span className="text-[10px] text-slate-400">•</span>
                            <span className="text-[10px] text-slate-500 font-semibold">
                              {cs.tag}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            onAddCrossSellItem({
                              id: cs.id,
                              name: cs.name,
                              tamilName: cs.tamilName,
                              weight: cs.weight,
                              price: cs.price,
                              image: cs.image,
                            })
                          }
                          className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black px-2.5 py-1.5 rounded-lg shadow-2xs transition-transform active:scale-95 shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ ₹{cs.price}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* B2B Commercial Compliance Details */}
              {isB2B && (
                <div className="bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-2xl space-y-2.5">
                  <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-emerald-700" />
                    Restaurant / Hotel Billing & Tax Invoice
                  </span>
                  <input
                    type="text"
                    placeholder="Restaurant / Mess / Catering Company Name"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-emerald-300 rounded-xl outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="GSTIN Number (For GST Tax Credit)"
                      maxLength={15}
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value.toUpperCase())}
                      className="w-full text-xs px-3 py-2 bg-white border border-emerald-300 rounded-xl outline-none font-mono focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              )}

              {/* WhatsApp Notification Number with Auto-fill & Verified Badge */}
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    WhatsApp Number (6:30 AM Live Tracking)
                  </label>
                  {currentUser?.phone && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Verified {currentUser.name ? `(${currentUser.name})` : ""}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={isB2B ? "Chef / Manager Name" : "Customer Name"}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-1/2 text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <input
                    type="tel"
                    placeholder="10-digit WhatsApp No"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    className="w-1/2 text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none font-mono font-bold text-slate-900 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* FULFILLMENT & VEHICLE ALLOCATION */}
              <div className="border border-slate-200 p-3.5 rounded-2xl bg-slate-50 space-y-3">
                <span className="text-xs font-bold text-slate-800 block">Fulfillment Preference</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryMode("porter")}
                    className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      deliveryMode === "porter"
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    {isB2B
                      ? needsCommercialTruck
                        ? "Porter Tata Ace (+₹180)"
                        : "Porter Commercial (+₹80)"
                      : "Porter Delivery (+₹60)"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMode("pickup")}
                    className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      deliveryMode === "pickup"
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    Direct Hub Pickup (₹0)
                  </button>
                </div>

                {deliveryMode === "porter" ? (
                  <div className="space-y-2 pt-1">
                    <input
                      type="text"
                      placeholder="Kitchen / Hotel Address & Landmark"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:ring-1 focus:ring-blue-600"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Pincode"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                        className="w-1/3 text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none font-mono focus:ring-1 focus:ring-blue-600"
                      />
                      <div className="flex-1 flex items-center gap-1.5 text-[11px] text-slate-600 bg-white px-3 py-1.5 border border-slate-200 rounded-xl">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>
                          Slot:{" "}
                          <strong>
                            {isB2B ? "5:30 AM – 7:00 AM (Hotel Prep)" : "6:30 AM – 8:00 AM"}
                          </strong>
                        </span>
                      </div>
                    </div>

                    {isB2B && needsCommercialTruck && (
                      <div className="text-[11px] text-blue-900 bg-blue-50 border border-blue-200 p-2 rounded-lg flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>
                          <strong>{totalWeightKg.toFixed(0)} KG Order:</strong> Auto-assigned to Porter Tata Ace with crushed ice crates.
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-[11px] text-amber-900 space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-amber-950">
                      <Store className="w-4 h-4 text-amber-700" />
                      Kasimedu Commercial Hub #4
                    </p>
                    <p className="text-amber-800 leading-relaxed">
                      Pick up directly between{" "}
                      <strong>{isB2B ? "5:00 AM – 6:30 AM" : "6:00 AM – 7:30 AM"}</strong> with
                      crates on ice.
                    </p>
                  </div>
                )}
              </div>

              {/* Harbor Contingency Fallback */}
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>4:00 AM Harbor Scarcity Policy</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setContingency("substitute")}
                    className={`p-2.5 rounded-xl font-medium border text-left transition-all ${
                      contingency === "substitute"
                        ? "bg-white border-blue-600 text-blue-900 font-bold shadow-xs ring-1 ring-blue-600"
                        : "border-transparent bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Replace with similar catch
                  </button>
                  <button
                    type="button"
                    onClick={() => setContingency("refund")}
                    className={`p-2.5 rounded-xl font-medium border text-left transition-all ${
                      contingency === "refund"
                        ? "bg-white border-blue-600 text-blue-900 font-bold shadow-xs ring-1 ring-blue-600"
                        : "border-transparent bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    8:30 AM Instant UPI refund
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Checkout Bill Breakdown */}
        {items.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2.5">
            {isB2B && !b2bMinMet && (
              <div className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-300 p-2 rounded-xl flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>B2B Minimum Order is ₹2,500. Add more crates to proceed.</span>
              </div>
            )}

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>{isB2B ? "Wholesale Crates Total" : "Seafood & Ambient Items"}</span>
                <span className="font-semibold">₹{fishSubtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>{isB2B ? "Flake Ice Crate Packaging" : "Insulated Pack & Ice"}</span>
                <span className="font-semibold">₹{packagingCharge}</span>
              </div>
              <div className="flex justify-between">
                <span>
                  {isB2B && needsCommercialTruck ? "Porter Tata Ace Transport" : "Porter Morning Delivery"}
                </span>
                <span className={deliveryMode === "pickup" ? "text-emerald-600 font-bold" : "font-semibold"}>
                  {deliveryMode === "porter" ? `₹${porterDeliveryCharge}` : "FREE (Self-Pickup)"}
                </span>
              </div>
              <div className="flex justify-between font-black text-base text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Payable</span>
                <span>₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <button
              type="button"
              disabled={isSubmitting || (isB2B && !b2bMinMet)}
              onClick={handlePayment}
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3.5 rounded-2xl shadow-md transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                "Processing MeenBox Order..."
              ) : (
                <>
                  <span>
                    Pay ₹{grandTotal.toLocaleString("en-IN")} & Confirm MeenBox
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
