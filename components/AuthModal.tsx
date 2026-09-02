"use client";

import React, { useState } from "react";
import { Phone, CheckCircle2, ShieldCheck, X, ArrowRight, Sparkles } from "lucide-react";

export interface AuthUser {
  name: string;
  phone: string;
  email?: string;
  authProvider: "google" | "phone";
  avatar?: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
}

export function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [authMethod, setAuthMethod] = useState<"choose" | "phone" | "otp" | "google_phone_link">("choose");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [googleUser, setGoogleUser] = useState<{ name: string; email: string; avatar?: string } | null>(null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // 1. Handle Google One-Tap / OAuth Click
  const handleGoogleLogin = () => {
    setLoading(true);
    // Simulate fast Google OAuth 2.0 handshake
    setTimeout(() => {
      setLoading(false);
      const demoGoogle = {
        name: "Karthik Subramanian",
        email: "karthik.subramanian@gmail.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      };
      setGoogleUser(demoGoogle);
      setName(demoGoogle.name);
      setEmail(demoGoogle.email);

      // Check if existing phone is bound
      const existing = localStorage.getItem("catch_user");
      if (existing) {
        try {
          const parsed = JSON.parse(existing);
          if (parsed.phone) {
            const user: AuthUser = {
              name: demoGoogle.name,
              email: demoGoogle.email,
              phone: parsed.phone,
              authProvider: "google",
              avatar: demoGoogle.avatar,
            };
            localStorage.setItem("catch_user", JSON.stringify(user));
            onLoginSuccess(user);
            onClose();
            return;
          }
        } catch {}
      }

      // If no phone attached, prompt 1-time phone link
      setAuthMethod("google_phone_link");
    }, 500);
  };

  // 2. Link Phone after Google sign-in
  const handleLinkGooglePhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      alert("Please enter a valid 10-digit WhatsApp number for 6:30 AM live tracking.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const user: AuthUser = {
        name: googleUser?.name || name || "Customer",
        email: googleUser?.email || email,
        phone: phone.trim(),
        authProvider: "google",
        avatar: googleUser?.avatar,
      };
      localStorage.setItem("catch_user", JSON.stringify(user));
      onLoginSuccess(user);
      onClose();
    }, 400);
  };

  // 3. Send Mobile OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      alert("Please enter a valid 10-digit WhatsApp number.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAuthMethod("otp");
    }, 500);
  };

  // 4. Verify Mobile OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) {
      alert("Please enter the verification code.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const user: AuthUser = {
        name: name.trim() || "Seafood Connoisseur",
        phone: phone.trim(),
        authProvider: "phone",
      };
      localStorage.setItem("catch_user", JSON.stringify(user));
      onLoginSuccess(user);
      onClose();
    }, 500);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[0];
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Icon Header */}
        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-cyan-400 flex items-center justify-center mb-4 shadow-sm">
          <Sparkles className="w-6 h-6" />
        </div>

        {/* 1. CHOOSE AUTH METHOD (GOOGLE OR PHONE) */}
        {authMethod === "choose" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Welcome to MeenBox
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Sign in to save delivery addresses, view order history, and receive 6:30 AM live Porter dispatch alerts.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 text-slate-800 font-bold text-xs py-3 rounded-2xl transition-all shadow-2xs active:scale-98"
              >
                {/* Official Google SVG Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  or
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Mobile OTP Button */}
              <button
                type="button"
                onClick={() => setAuthMethod("phone")}
                className="w-full flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-2xl transition-all shadow-sm active:scale-98"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Sign in with Mobile OTP</span>
              </button>
            </div>

            <div className="pt-2 text-center">
              <span className="text-[10px] text-slate-400">
                🔒 Zero password friction. Encrypted session handshake.
              </span>
            </div>
          </div>
        )}

        {/* 2. GOOGLE ACCOUNT 1-TIME PHONE LINKING */}
        {authMethod === "google_phone_link" && (
          <form onSubmit={handleLinkGooglePhone} className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md inline-block mb-1">
                Google Account Verified ✓
              </span>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Link WhatsApp Phone Number
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Hi {googleUser?.name}! Enter your 10-digit number to receive live 6:30 AM morning Porter tracking alerts.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  10-Digit WhatsApp Mobile
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-2.5 rounded-xl border border-slate-200">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="98401 10022"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono focus:ring-2 focus:ring-blue-600 focus:bg-white font-bold"
                    autoFocus
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 rounded-2xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <span>Complete & Link Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* 3. PHONE NUMBER ENTRY */}
        {authMethod === "phone" && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <button
                type="button"
                onClick={() => setAuthMethod("choose")}
                className="text-[11px] font-bold text-blue-600 hover:underline mb-1 inline-block"
              >
                &larr; Back to login options
              </button>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Mobile OTP Login
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                We will send an instant 6-digit verification code over WhatsApp.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Anandha Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  10-Digit Mobile Number
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-2.5 rounded-xl border border-slate-200">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="98401 23456"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono focus:ring-2 focus:ring-blue-600 focus:bg-white font-bold"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-black text-white font-bold text-xs py-3.5 rounded-2xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <span>{loading ? "Sending Code..." : "Send Verification Code"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* 4. OTP VERIFICATION */}
        {authMethod === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <button
                type="button"
                onClick={() => setAuthMethod("phone")}
                className="text-[11px] font-bold text-blue-600 hover:underline mb-1 inline-block"
              >
                &larr; Change number (+91 {phone})
              </button>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Enter 6-Digit Code
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sent to WhatsApp number <strong>+91 {phone}</strong>
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between gap-1.5">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-11 h-12 text-center text-lg font-black font-mono bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:bg-white"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 rounded-2xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{loading ? "Verifying..." : "Verify & Proceed"}</span>
              </button>
            </div>
          </form>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>FoSCoS Certified MeenBox Direct Identity</span>
        </div>
      </div>
    </div>
  );
}
