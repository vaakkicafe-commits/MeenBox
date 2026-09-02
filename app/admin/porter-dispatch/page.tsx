"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Truck, Send, MapPin, CheckCircle, ExternalLink, Users, ChevronLeft, Scissors, Lock, Unlock, ShieldAlert } from "lucide-react";

interface DispatchCluster {
  zoneName: string;
  pincode: string;
  assignedDriver: string;
  driverPhone: string;
  vehicle: string;
  orderCount: number;
  orders: {
    id: string;
    customerName: string;
    phone: string;
    address: string;
    status: "ready" | "dispatched";
  }[];
}

export default function PorterDispatchPage() {
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
  const [clusters, setClusters] = useState<DispatchCluster[]>([
    {
      zoneName: "Anna Nagar / Kilpauk Cluster",
      pincode: "600040",
      assignedDriver: "S. Murugan",
      driverPhone: "9840110022",
      vehicle: "TN 04 BV 4912 (Bajaj Pulsar / Insulated Bag)",
      orderCount: 4,
      orders: [
        {
          id: "KSM-1041",
          customerName: "Rajesh K.",
          phone: "9840123456",
          address: "14, 2nd Avenue, Anna Nagar East",
          status: "ready",
        },
        {
          id: "KSM-1042",
          customerName: "Anita S.",
          phone: "9840987654",
          address: "Plot 8B, Ormes Road, Kilpauk",
          status: "ready",
        },
      ],
    },
    {
      zoneName: "T. Nagar / Mylapore Cluster",
      pincode: "600017",
      assignedDriver: "K. Venkatesh",
      driverPhone: "9840223344",
      vehicle: "TN 09 CD 7781 (Honda Activa / Insulated Box)",
      orderCount: 3,
      orders: [
        {
          id: "KSM-1043",
          customerName: "Murugan V.",
          phone: "9840112233",
          address: "55, North Usman Rd, T. Nagar",
          status: "ready",
        },
        {
          id: "KSM-1044",
          customerName: "Priya D.",
          phone: "9840445566",
          address: "22, Luz Church Road, Mylapore",
          status: "ready",
        },
      ],
    },
  ]);

  const dispatchCluster = async (clusterIndex: number) => {
    const cluster = clusters[clusterIndex];

    for (const order of cluster.orders) {
      // Trigger WhatsApp API with live tracking link
      try {
        await fetch("/api/notifications/whatsapp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "PORTER_DISPATCHED",
            phone: order.phone,
            orderId: order.id,
            customerName: order.customerName,
            driverName: cluster.assignedDriver,
            trackingUrl: `http://localhost:3000/track/${order.id}`,
            eta: "7:25 AM",
          }),
        });
      } catch (e) {
        console.error(e);
      }
    }

    setClusters((prev) =>
      prev.map((c, i) =>
        i === clusterIndex
          ? {
              ...c,
              orders: c.orders.map((o) => ({ ...o, status: "dispatched" })),
            }
          : c
      )
    );

    alert(`Dispatched Porter cluster for ${cluster.zoneName}! WhatsApp live tracking alerts triggered.`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans selection:bg-blue-600 selection:text-white">
        <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-14 h-14 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>

          <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
            Logistics Console Only
          </span>

          <h1 className="text-2xl font-black text-white mt-3">
            Porter Cluster Dispatch
          </h1>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            Enter your Master Admin PIN to assign PIN cluster drivers and trigger live WhatsApp tracking alerts.
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
                className="w-full text-center text-lg tracking-widest font-mono font-bold py-3 bg-slate-900 border border-slate-700 text-white rounded-2xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
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
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3.5 rounded-2xl shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Dispatch Console</span>
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
        {/* Top Nav */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 transition-colors shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Customer Storefront</span>
          </Link>
          <Link
            href="/admin/cutter-sheet"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors"
          >
            <Scissors className="w-4 h-4" />
            <span>Harbor Cutter Sheet &rarr;</span>
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Truck className="w-6 h-6 text-emerald-600" />
              <h1 className="text-xl font-black text-slate-900">
                Morning Porter Zone Cluster Dispatcher
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Multi-drop route grouping for 6:30 AM – 8:00 AM delivery windows
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-900 shadow-xs">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>2 Porter Riders Assigned</span>
          </div>
        </div>

        {/* Clusters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {clusters.map((cluster, idx) => {
            const allDispatched = cluster.orders.every((o) => o.status === "dispatched");

            return (
              <div
                key={cluster.zoneName}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Zone Header */}
                  <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">{cluster.zoneName}</h2>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        <span>
                          PIN: <strong>{cluster.pincode}</strong> • {cluster.orders.length} Drops
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full">
                      {cluster.vehicle.split("(")[0].trim()}
                    </span>
                  </div>

                  {/* Rider Details */}
                  <div className="p-3 bg-blue-50/50 border-b border-blue-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500">Rider: </span>
                      <span className="font-bold text-slate-900">{cluster.assignedDriver}</span>
                      <span className="text-slate-400 font-mono ml-1">({cluster.driverPhone})</span>
                    </div>
                    <a
                      href={`tel:${cluster.driverPhone}`}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Call Rider
                    </a>
                  </div>

                  {/* Orders In Cluster */}
                  <div className="p-4 divide-y divide-slate-100">
                    {cluster.orders.map((o) => (
                      <div
                        key={o.id}
                        className="py-3 first:pt-0 last:pb-0 flex justify-between items-start text-xs gap-2"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                              {o.id}
                            </span>
                            <span className="font-semibold text-slate-900">{o.customerName}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 leading-tight">{o.address}</p>
                        </div>
                        {o.status === "dispatched" ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shrink-0">
                            <CheckCircle className="w-3 h-3" /> Dispatched
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md shrink-0">
                            Ready on Ice
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dispatch Trigger */}
                <div className="p-4 border-t border-slate-100 bg-slate-50">
                  <button
                    type="button"
                    disabled={allDispatched}
                    onClick={() => dispatchCluster(idx)}
                    className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      allDispatched
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-98"
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    {allDispatched
                      ? "Cluster Dispatched & Tracking Live"
                      : "Handover to Porter & Trigger WhatsApp Links"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
