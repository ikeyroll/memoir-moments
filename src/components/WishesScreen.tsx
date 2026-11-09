"use client";

import React, { useState } from "react";
import { useMemoir } from "@/context/MemoirContext";
import { HeartIcon } from "./RedesignIcons";
import { formatRelativeTime } from "@/lib/utils";

export function WishesScreen() {
  const { wishes, createWish, toggleLikeWish, deleteWish, session } = useMemoir();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [relationship, setRelationship] = useState("Friend");
  const [error, setError] = useState<string | null>(null);

  const handleSendWish = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!message.trim()) {
      setError("Please write your blessing.");
      return;
    }
    const res = createWish(message.trim(), relationship);
    if (res.success) {
      setMessage("");
      setIsSheetOpen(false);
    } else {
      setError(res.error || "Failed to submit.");
    }
  };

  return (
    <div className="min-h-[85dvh] bg-white dark:bg-black text-[#151515] dark:text-[#F5F5F5] max-w-[430px] mx-auto pb-24 transition-colors">
      {/* Screen 09 Header: Simple page, title Wedding wishes and one short invitation line */}
      <div className="px-5 py-4 border-b border-[#ECECEC] dark:border-[#262626]">
        <h1 className="font-serif text-2xl font-bold tracking-tight text-[#151515] dark:text-[#F5F5F5]">
          Wedding wishes
        </h1>
        <p className="text-xs text-[#666666] dark:text-[#A0A0A0] mt-0.5">
          A little love, kept forever
        </p>
      </div>

      {/* Wishes List */}
      <div className="p-4 space-y-3">
        {wishes.map((wish) => {
          const isLiked = session ? wish.likedByNicknames.includes(session.nickname) : false;
          const isOwn = session?.nickname === wish.authorNickname || session?.role === "host";

          return (
            <div
              key={wish.id}
              className="p-4 bg-white dark:bg-[#121212] border border-[#ECECEC] dark:border-[#262626] rounded-2xl shadow-xs flex items-start justify-between space-x-3 transition-colors"
            >
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                {/* Initial circle A, H, N, R */}
                <div className="w-10 h-10 rounded-full bg-[#F9ECEF] dark:bg-[#2D1B22] text-[#A6475B] dark:text-[#FB7185] font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {wish.authorNickname.slice(0, 1).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-semibold text-xs text-[#151515] dark:text-[#F5F5F5] leading-tight">
                      {wish.authorNickname}
                    </h3>
                    <span className="text-[10px] text-[#666666] dark:text-[#888888] font-mono">
                      {formatRelativeTime(wish.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-[#151515] dark:text-[#E0E0E0] leading-relaxed mt-1">
                    {wish.message}
                  </p>
                  {isOwn && (
                    <button
                      onClick={() => deleteWish(wish.id)}
                      className="text-[10px] text-[#A6475B] dark:text-[#FB7185] hover:underline mt-1 block"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>

              {/* Heart like reaction */}
              <button
                onClick={() => toggleLikeWish(wish.id)}
                className="p-1 text-[#666666] dark:text-[#888888] hover:text-[#A6475B] dark:hover:text-[#FB7185] flex-shrink-0"
                aria-label="Like wish"
              >
                <HeartIcon filled={isLiked} className={isLiked ? "w-4 h-4 text-[#A6475B] dark:text-[#FB7185]" : "w-4 h-4 text-[#666666] dark:text-[#888888]"} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Primary Bottom Action: Leave a wish (Dusty rose #A6475B button with pencil) */}
      <div className="fixed bottom-16 inset-x-0 p-4 max-w-[430px] mx-auto pointer-events-none">
        <button
          onClick={() => setIsSheetOpen(true)}
          className="w-full py-3.5 bg-[#A6475B] hover:bg-[#8F3B4D] active:scale-[0.98] text-white rounded-2xl text-xs font-bold transition-all shadow-lg flex items-center justify-center space-x-2 pointer-events-auto"
        >
          <span>✎</span>
          <span>Leave a wish</span>
        </button>
      </div>

      {/* Leave a Wish Sheet with 500-character counter */}
      {isSheetOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center sm:items-center p-0 sm:p-4 animate-in fade-in duration-150">
          <form
            onSubmit={handleSendWish}
            className="bg-white dark:bg-[#121212] rounded-t-3xl sm:rounded-2xl p-5 w-full max-w-sm shadow-2xl space-y-3 border-t sm:border border-[#ECECEC] dark:border-[#262626]"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#ECECEC] dark:border-[#262626]">
              <h3 className="font-bold text-sm text-[#151515] dark:text-[#F5F5F5]">Leave a Wedding Blessing</h3>
              <button
                type="button"
                onClick={() => setIsSheetOpen(false)}
                className="text-[#666666] dark:text-[#A0A0A0] text-sm p-1 font-bold"
              >
                ✕
              </button>
            </div>

            {error && <p className="text-xs text-[#A6475B] dark:text-[#FB7185]">{error}</p>}

            <div>
              <label className="text-[11px] font-semibold text-[#666666] dark:text-[#A0A0A0] block mb-1">Your Connection</label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full p-2.5 text-xs border border-[#ECECEC] dark:border-[#262626] rounded-xl bg-white dark:bg-[#1A1A1A] text-[#151515] dark:text-white"
              >
                <option value="Friend">Friend</option>
                <option value="Family">Family Member</option>
                <option value="Bridesmaid">Bridesmaid / Groomsman</option>
                <option value="Colleague">Colleague</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#666666] dark:text-[#A0A0A0] block mb-1">Your Message</label>
              <textarea
                rows={4}
                placeholder="Write your prayers and joy for Farah & Daniyal..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 text-xs border border-[#ECECEC] dark:border-[#262626] rounded-xl bg-white dark:bg-[#1A1A1A] text-[#151515] dark:text-white focus:outline-none focus:border-[#A6475B] dark:focus:border-[#FB7185] resize-none"
                maxLength={500}
                required
              />
              <span className="text-[10px] text-[#666666] dark:text-[#888888] font-mono text-right block">
                {message.length}/500
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#A6475B] hover:bg-[#8F3B4D] active:scale-[0.98] text-white rounded-xl text-xs font-bold transition-all"
            >
              Send Blessing
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

