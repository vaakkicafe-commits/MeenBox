"use client";

import React, { useState } from "react";
import { Star, ShieldCheck, ThumbsUp, MessageSquare, Send, UserCheck, CheckCircle2 } from "lucide-react";

interface CommentItem {
  id: string;
  authorName: string;
  area: string;
  isVerifiedBuyer: boolean;
  memberSince: string;
  rating: number;
  date: string;
  comment: string;
  refundProof?: string;
  likes: number;
}

const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: "c1",
    authorName: "Senthil Nathan",
    area: "Anna Nagar West",
    isVerifiedBuyer: true,
    memberSince: "Member since 2025",
    rating: 5,
    date: "Yesterday, 7:15 AM",
    comment:
      "Ordered 1kg Vanjaram fry slices last night at 10 PM. Porter rider reached my gate at 7:10 AM with ice packs still frozen cold. Net cut weight was accurate. No supermarket fish comes close to this freshness.",
    likes: 24,
  },
  {
    id: "c2",
    authorName: "Dr. Malini R.",
    area: "Kilpauk",
    isVerifiedBuyer: true,
    memberSince: "Member since 2025",
    rating: 5,
    date: "3 days ago",
    comment:
      "Last Sunday, White Pomfret was unavailable due to rough sea. By 8:15 AM, I received an instant GPay refund with a WhatsApp explanation before I even had to ask. That gained my complete trust. Re-ordered Sankara today!",
    refundProof: "Verified ₹920 Instant Refund by 8:15 AM",
    likes: 42,
  },
  {
    id: "c3",
    authorName: "Karthik Subramanian",
    area: "Mylapore",
    isVerifiedBuyer: true,
    memberSince: "Member since 2026",
    rating: 5,
    date: "5 days ago",
    comment:
      "The Whole Uncut toggle is great because my grandmother prefers cleaning it herself at home. Saved the cleaning fee and got sea prawns fresh off the boat.",
    likes: 18,
  },
];

export function TrustCommentSection() {
  const [comments, setComments] = useState<CommentItem[]>(INITIAL_COMMENTS);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [area, setArea] = useState("");
  const [rating, setRating] = useState(5);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;

    const entry: CommentItem = {
      id: `c_${Date.now()}`,
      authorName: authorName.trim(),
      area: area.trim() || "Chennai Customer",
      isVerifiedBuyer: true,
      memberSince: "Registered Member",
      rating,
      date: "Just now",
      comment: newComment.trim(),
      likes: 1,
    };

    setComments([entry, ...comments]);
    setNewComment("");
    setAuthorName("");
    setArea("");
  };

  const handleLike = (id: string) => {
    if (likedMap[id]) return;
    setLikedMap((prev) => ({ ...prev, [id]: true }));
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  return (
    <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 mt-12 mb-8 shadow-xs">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Customer Experiences & Harbor Catch Log
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real feedback from verified morning pre-order buyers across Chennai.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-blue-50/80 border border-blue-100 px-4 py-2.5 rounded-2xl shrink-0">
          <div className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-xs font-bold text-slate-800">4.9 / 5 (380+ Harbor Orders)</span>
        </div>
      </div>

      {/* Post a Review Form */}
      <form onSubmit={handleSubmit} className="my-6 bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-emerald-600" />
          Share Your Experience (Registered Members)
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Your Name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="text-xs px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 outline-none focus:ring-1 focus:ring-blue-600"
            required
          />
          <input
            type="text"
            placeholder="Your Area (e.g. Anna Nagar, T. Nagar)"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="text-xs px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 outline-none focus:ring-1 focus:ring-blue-600"
          />
          <div className="flex items-center justify-between bg-white border border-slate-300 rounded-xl px-3.5 py-2">
            <span className="text-xs text-slate-500 font-medium">Rating:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setRating(num)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-4 h-4 ${
                      num <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <textarea
          placeholder="How was your morning delivery, ice packing, and fish freshness? (Mention refund speed if your catch had to be substituted)"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          className="w-full text-xs p-3.5 rounded-xl bg-white border border-slate-300 outline-none focus:ring-1 focus:ring-blue-600 resize-none"
          required
        />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-500">
            🛡️ Badges are matched automatically against your registered order number.
          </span>
          <button
            type="submit"
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            Post Review
          </button>
        </div>
      </form>

      {/* Comment Stream */}
      <div className="space-y-4">
        {comments.map((item) => (
          <article
            key={item.id}
            className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-2xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-slate-900">{item.authorName}</span>
                <span className="text-xs text-slate-500">• {item.area}</span>
                {item.isVerifiedBuyer && (
                  <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Morning Buyer
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="flex text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span>{item.date}</span>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">{item.comment}</p>

            {item.refundProof && (
              <div className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-900 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>{item.refundProof}</span>
              </div>
            )}

            <div className="flex items-center gap-4 mt-3 pt-2.5 border-t border-slate-100 text-slate-400 text-xs">
              <button
                type="button"
                onClick={() => handleLike(item.id)}
                className={`flex items-center gap-1 font-medium transition-colors ${
                  likedMap[item.id] ? "text-blue-600 font-bold" : "hover:text-blue-600"
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Helpful ({item.likes})</span>
              </button>
              <span className="text-[11px] text-slate-400 font-mono">{item.memberSince}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
