"use client";

import React from "react";
import { ShieldCheck, RotateCcw, Award } from "lucide-react";

export function TrustGuaranteeBanner() {
  return (
    <section className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 mb-8 border border-blue-800/80 shadow-md">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              100% Registered Member Protection
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
            Kasimedu Direct Catch & Morning Refund Guarantee
          </h2>
          <p className="text-xs text-blue-200 max-w-xl leading-relaxed">
            If rough sea weather or harbor scarcity prevents your fish from landing at 4:00 AM, your payment is 
            <strong> 100% refunded to your original UPI/bank account by 8:30 AM</strong>—no customer support tickets required, automatic WhatsApp notification sent.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <div className="flex items-center gap-2.5 bg-white/10 px-3.5 py-2.5 rounded-2xl border border-white/10 text-xs backdrop-blur-xs">
            <RotateCcw className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-slate-100">8:30 AM Auto-Refund</p>
              <p className="text-[10px] text-blue-200">Direct to GPay / PhonePe</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-white/10 px-3.5 py-2.5 rounded-2xl border border-white/10 text-xs backdrop-blur-xs">
            <ShieldCheck className="w-5 h-5 text-blue-300 shrink-0" />
            <div>
              <p className="font-bold text-slate-100">FoSCoS Certified</p>
              <p className="text-[10px] text-blue-200">Govt. Registered Hub #4</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
