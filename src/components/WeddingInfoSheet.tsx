"use client";

import React, { useState } from "react";
import { useMemoir } from "@/context/MemoirContext";
import { XMarkIcon } from "./Icons";
import { SAMPLE_WEDDING_PHOTOS } from "@/lib/sampleData";

export function WeddingInfoSheet() {
  const { weddingDetails, isWeddingInfoSheetOpen, setIsWeddingInfoSheetOpen, setIsHostStudioOpen, setIsWeddingSettingsOpen, session } = useMemoir();
  const [copied, setCopied] = useState(false);

  if (!isWeddingInfoSheetOpen) return null;

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Wedding details"
    >
      <div className="bg-white dark:bg-[#121212] w-full max-w-[430px] rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl flex flex-col space-y-4 animate-in slide-in-from-bottom duration-200 border-t sm:border border-[#ECECEC] dark:border-[#262626]">
        <div className="flex items-center justify-between pb-2 border-b border-[#ECECEC] dark:border-[#262626]">
          <div className="flex items-center space-x-2">
            <span className="font-serif italic font-bold text-xl text-[#A6475B] dark:text-[#FB7185]">Memoir</span>
            <span className="text-xs text-[#666666] dark:text-[#A0A0A0]">Wedding Details</span>
          </div>
          <button
            onClick={() => setIsWeddingInfoSheetOpen(false)}
            className="p-1 text-[#666666] dark:text-[#A0A0A0] hover:text-[#151515] dark:hover:text-white"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Couple & Date */}
        <div className="space-y-1 text-center py-2">
          <h2 className="font-serif text-2xl font-bold text-[#151515] dark:text-[#F5F5F5]">
            {weddingDetails.coupleNames}
          </h2>
          <p className="text-xs text-[#A6475B] dark:text-[#FB7185] font-semibold">
            {weddingDetails.weddingDate}
          </p>
          <p className="text-xs text-[#666666] dark:text-[#888888]">
            📍 {weddingDetails.venueName}, {weddingDetails.city}
          </p>
        </div>

        {/* Welcome greeting */}
        <p className="text-xs text-[#151515] dark:text-[#E0E0E0] bg-[#F8F8F8] dark:bg-[#1A1A1A] p-3 rounded-xl leading-relaxed">
          {weddingDetails.welcomeNote}
        </p>

        {/* Action Row */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleCopyLink}
            className="w-full py-2.5 bg-[#F8F8F8] dark:bg-[#1A1A1A] hover:bg-[#ECECEC] dark:hover:bg-[#2C2C2E] text-[#151515] dark:text-white rounded-xl text-xs font-semibold transition-colors"
          >
            {copied ? "Link Copied! ✓" : "Copy Wedding Gallery Link"}
          </button>

          {session?.role === "host" ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsWeddingInfoSheetOpen(false);
                  setIsHostStudioOpen(true);
                }}
                className="py-2.5 bg-[#151515] dark:bg-white text-white dark:text-[#151515] rounded-xl text-xs font-semibold"
              >
                Host Studio
              </button>
              <button
                onClick={() => {
                  setIsWeddingInfoSheetOpen(false);
                  setIsWeddingSettingsOpen(true);
                }}
                className="py-2.5 border border-[#ECECEC] dark:border-[#262626] text-[#151515] dark:text-white rounded-xl text-xs font-semibold hover:bg-[#F8F8F8] dark:hover:bg-[#1C1C1E]"
              >
                Settings
              </button>
            </div>
          ) : (
            <div className="p-2.5 text-center text-[11px] text-[#666666] dark:text-[#888888] bg-[#F8F8F8] dark:bg-[#1A1A1A] rounded-xl">
              Local Browser Demo: Photos saved into IndexedDB on this device.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

