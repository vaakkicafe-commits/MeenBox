"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Anchor,
  Scissors,
  PackageCheck,
  Bike,
  CheckCircle,
  Phone,
  MapPin,
  ExternalLink,
  ChevronLeft,
  Sparkles,
  Store,
  RefreshCw,
  Star,
} from "lucide-react";

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = (params?.orderId as string) || "KSM-1041";

  const [orderStatus, setOrderStatus] = useState<string>("dispatched");
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [driver, setDriver] = useState({
    name: "S. Murugan",
    phone: "+91 98401 10022",
    vehicle: "TN 04 BV 4912 (Porter Bike)",
    eta: "7:25 AM",
    porterTrackingUrl: "https://porter.in",
  });
  const [isSimulating, setIsSimulating] = useState(false);

  // Auto-polling every 4 seconds to sync status in real time
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/orders/status?orderId=${orderId}`);
        const data = await res.json();
        if (data?.order) {
          setOrderDetails(data.order);
          if (data.order.status) {
            setOrderStatus(data.order.status);
          }
          if (data.order.driver) {
            setDriver((prev) => ({ ...prev, ...data.order.driver }));
          }
        }
      } catch (err) {
        console.error("Status polling error:", err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 4000);
    return () => clearInterval(interval);
  }, [orderId]);

  const isDelivered = orderStatus === "delivered";
  const isSelfPickup = orderDetails?.deliveryMode === "pickup";

  // Simulate delivery webhook trigger
  const handleSimulateDelivery = async () => {
    setIsSimulating(true);
    try {
      await fetch("/api/orders/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          newStatus: "delivered",
        }),
      });
      setOrderStatus("delivered");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center p-3 sm:py-8 font-sans selection:bg-blue-600 selection:text-white">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        {/* Navigation Bar */}
        <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1 text-xs text-slate-300 hover:text-white font-semibold py-1 px-2 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Storefront</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Live Polling (Every 4s)
            </span>
          </div>
        </div>

        {/* Dynamic Header */}
        <div
          className={`p-6 text-white transition-colors duration-500 relative overflow-hidden ${
            isDelivered ? "bg-emerald-600" : "bg-blue-600"
          }`}
        >
          <div className="flex justify-between items-start relative z-10">
            <div>
              <span className="text-xs font-mono font-bold tracking-wider uppercase opacity-80">
                Order #{orderId}
              </span>
              <h1 className="text-2xl font-black mt-1">
                {isDelivered
                  ? "Delivered & Freshly Received"
                  : isSelfPickup
                  ? "Ready for Morning Hub Pickup"
                  : "Out for Morning Delivery"}
              </h1>
              <p className="text-xs opacity-90 mt-1">
                {isDelivered
                  ? "Handed over fresh on ice. Ready for the kitchen!"
                  : isSelfPickup
                  ? "Available at Kasimedu Hub #4 until 7:30 AM"
                  : `Expected at your doorstep by ${driver.eta}`}
              </p>
            </div>
            <div className="h-12 w-12 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-xs">
              {isDelivered ? (
                <CheckCircle className="w-7 h-7 text-white" />
              ) : isSelfPickup ? (
                <Store className="w-6 h-6 text-white" />
              ) : (
                <Bike className="w-6 h-6 text-white animate-bounce" />
              )}
            </div>
          </div>
        </div>

        {/* Driver Card (Only visible when still out for delivery) */}
        {!isDelivered && !isSelfPickup && (
          <>
            <div className="p-4 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
                  SM
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900">{driver.name} (Porter Rider)</h3>
                  <p className="text-[11px] text-slate-500">{driver.vehicle}</p>
                </div>
              </div>

              <a
                href={`tel:${driver.phone}`}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Driver
              </a>
            </div>

            {/* Live GPS Map Trigger */}
            <div className="p-4 border-b border-slate-100 bg-white">
              <a
                href={driver.porterTrackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-slate-900 hover:bg-black text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
              >
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Open Live Porter GPS Tracking</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </>
        )}

        {/* Live Status Vertical Timeline */}
        <div className="p-6 space-y-6">
          <h2 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-4">
            Seafood Cold-Chain Pipeline
          </h2>

          <div className="relative pl-7 space-y-6 before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200">
            {/* Step 1 */}
            <div className="relative flex items-start gap-3">
              <span className="absolute -left-7 top-0.5 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-white shadow-xs">
                ✓
              </span>
              <div>
                <div className="flex justify-between items-baseline">
                  <p className="text-xs font-bold text-slate-900">Harbor Auction Procured</p>
                  <span className="text-[10px] font-mono text-slate-400">4:15 AM</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Secured fresh from Kasimedu harbor boat landings
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex items-start gap-3">
              <span className="absolute -left-7 top-0.5 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-white shadow-xs">
                ✓
              </span>
              <div>
                <div className="flex justify-between items-baseline">
                  <p className="text-xs font-bold text-slate-900">Cleaned & Ice Packed</p>
                  <span className="text-[10px] font-mono text-slate-400">5:30 AM</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Custom sliced & sealed at 0°C–4°C in food-grade thermal box
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex items-start gap-3">
              <span
                className={`absolute -left-7 top-0.5 w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-bold ring-4 ring-white shadow-xs transition-colors ${
                  isDelivered ? "bg-emerald-600" : "bg-blue-600 animate-pulse"
                }`}
              >
                {isDelivered ? "✓" : "🛵"}
              </span>
              <div>
                <div className="flex justify-between items-baseline">
                  <p className="text-xs font-bold text-slate-900">
                    {isSelfPickup ? "Kasimedu Hub Ready" : "Porter Dispatched"}
                  </p>
                  <span className="text-[10px] font-mono text-slate-400">6:35 AM</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isSelfPickup
                    ? "Available for counter pickup at Hub #4"
                    : "Rider carrying insulated multi-drop cooler box"}
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative flex items-start gap-3">
              <span
                className={`absolute -left-7 top-0.5 w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-bold ring-4 ring-white shadow-xs transition-colors ${
                  isDelivered ? "bg-emerald-600" : "bg-slate-300 text-slate-500"
                }`}
              >
                {isDelivered ? "✓" : "🏠"}
              </span>
              <div>
                <div className="flex justify-between items-baseline">
                  <p
                    className={`text-xs font-bold ${
                      isDelivered ? "text-emerald-700 font-extrabold" : "text-slate-400"
                    }`}
                  >
                    Doorstep Delivery Handover
                  </p>
                  <span className="text-[10px] font-mono text-slate-400">
                    {isDelivered ? "Completed" : "Est. 7:25 AM"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isDelivered
                    ? "Successfully handed over to customer fresh on ice"
                    : "Awaiting arrival at doorstep"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Completion & Feedback Card */}
        {isDelivered ? (
          <div className="m-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-black text-emerald-950">Delivered Successfully!</p>
                <p className="text-[11px] text-emerald-800">
                  Two-way WhatsApp receipt & delivery confirmation alerts dispatched.
                </p>
              </div>
            </div>

            {/* Quick Star Rating */}
            <div className="bg-white p-3 rounded-xl border border-emerald-200/80 text-center">
              <p className="text-xs font-bold text-slate-800 mb-1.5">Rate Morning Freshness</p>
              <div className="flex justify-center gap-2 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5 fill-amber-400 cursor-pointer hover:scale-110 transition-transform" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Demo Webhook Test Button for live status trigger */
          <div className="m-4 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
            <button
              type="button"
              disabled={isSimulating}
              onClick={handleSimulateDelivery}
              className="w-full py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs active:scale-98"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin" : ""}`} />
              <span>Simulate Porter Delivery Completion</span>
            </button>
            <p className="text-[10px] text-slate-400 mt-1">
              (Triggers Porter Webhook $\rightarrow$ Real-time Polling Flip $\rightarrow$ Dual WhatsApp alerts)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
