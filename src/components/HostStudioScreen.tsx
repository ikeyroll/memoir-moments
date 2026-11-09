"use client";

import React, { useState } from "react";
import { useMemoir } from "@/context/MemoirContext";
import { SAMPLE_WEDDING_PHOTOS } from "@/lib/sampleData";

export function HostStudioScreen() {
  const {
    weddingDetails,
    posts,
    wishes,
    setIsHostStudioOpen,
    setIsWeddingSettingsOpen,
    approvePost,
    rejectPost,
    getMediaDataUrl,
  } = useMemoir();

  const [activeTab, setActiveTab] = useState<"overview" | "content" | "settings">("content");
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);

  const pendingPosts = posts.filter((p) => p.status === "pending");
  const approvedPosts = posts.filter((p) => p.status === "approved");

  const handleToggleSelect = (id: string) => {
    setSelectedPostIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleApproveSelected = () => {
    selectedPostIds.forEach((id) => approvePost(id));
    setSelectedPostIds([]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-black text-[#151515] dark:text-[#F5F5F5] flex flex-col max-w-[430px] mx-auto animate-in slide-in-from-right duration-200">
      {/* Header: Screen 11 Host Studio */}
      <div className="px-4 py-3.5 border-b border-[#ECECEC] dark:border-[#262626] flex items-center justify-between">
        <div>
          <h2 className="font-bold text-base text-[#151515] dark:text-[#F5F5F5] leading-tight">Wedding studio</h2>
          <p className="text-xs text-[#666666] dark:text-[#A0A0A0]">{weddingDetails.coupleNames}</p>
        </div>
        <button
          onClick={() => setIsHostStudioOpen(false)}
          className="text-base text-[#151515] dark:text-[#F5F5F5] font-bold p-1 hover:opacity-75"
          aria-label="Close studio"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Banner with Preview wedding button */}
        <div className="relative h-44 bg-stone-900 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={weddingDetails.coverPhotoUrl || SAMPLE_WEDDING_PHOTOS.couple_cover}
            alt="Wedding Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <button
              onClick={() => setIsHostStudioOpen(false)}
              className="px-4 py-2 bg-white/95 dark:bg-black/80 text-[#151515] dark:text-white rounded-full text-xs font-bold shadow-md hover:bg-white flex items-center space-x-1.5 backdrop-blur-xs"
            >
              <span>↗</span>
              <span>Preview wedding</span>
            </button>
          </div>
        </div>

        {/* Tabs: Overview, Content (active in rose pill), Settings */}
        <div className="p-3 border-b border-[#ECECEC] dark:border-[#262626] flex items-center justify-around text-xs font-bold bg-white dark:bg-black">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-1.5 rounded-full transition-colors ${
              activeTab === "overview"
                ? "bg-[#A6475B] text-white"
                : "bg-[#F8F8F8] dark:bg-[#1C1C1E] text-[#666666] dark:text-[#A0A0A0]"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("content")}
            className={`px-4 py-1.5 rounded-full transition-colors ${
              activeTab === "content"
                ? "bg-[#A6475B] text-white"
                : "bg-[#F8F8F8] dark:bg-[#1C1C1E] text-[#666666] dark:text-[#A0A0A0]"
            }`}
          >
            Content
          </button>
          <button
            onClick={() => setIsWeddingSettingsOpen(true)}
            className="px-4 py-1.5 rounded-full bg-[#F8F8F8] dark:bg-[#1C1C1E] text-[#666666] dark:text-[#A0A0A0] hover:text-[#151515] dark:hover:text-white"
          >
            Settings
          </button>
        </div>

        {/* Accurate counts: Photos, Pending, Wishes */}
        <div className="p-4 grid grid-cols-3 gap-2 text-center border-b border-[#ECECEC] dark:border-[#262626] bg-[#F8F8F8]/50 dark:bg-[#141414]">
          <div>
            <span className="block font-bold text-lg text-[#151515] dark:text-white tabular-nums">{approvedPosts.length}</span>
            <span className="text-[11px] text-[#666666] dark:text-[#888888]">Photos</span>
          </div>
          <div>
            <span className="block font-bold text-lg text-[#A6475B] dark:text-[#FB7185] tabular-nums">{pendingPosts.length}</span>
            <span className="text-[11px] text-[#666666] dark:text-[#888888]">Pending</span>
          </div>
          <div>
            <span className="block font-bold text-lg text-[#151515] dark:text-white tabular-nums">{wishes.length}</span>
            <span className="text-[11px] text-[#666666] dark:text-[#888888]">Wishes</span>
          </div>
        </div>

        {activeTab === "overview" ? (
          <div className="p-4 space-y-4">
            {/* Event Summary Card */}
            <div className="p-3.5 rounded-2xl border border-[#ECECEC] dark:border-[#262626] bg-[#FBF9F5] dark:bg-[#141210] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#B88746] dark:text-[#E5C282]">
                  Live Event Summary
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                  ● Active
                </span>
              </div>
              <p className="text-xs font-semibold text-[#151515] dark:text-white">
                {weddingDetails.coupleNames} • {weddingDetails.weddingDate}
              </p>
              <p className="text-[11px] text-[#666666] dark:text-[#A0A0A0]">
                📍 {weddingDetails.venueName} • Guest PIN: <strong className="text-[#151515] dark:text-white">{weddingDetails.guestPin || "Open"}</strong>
              </p>
            </div>

            {/* Recent Guest Wishes */}
            <div>
              <h3 className="font-bold text-xs text-[#151515] dark:text-[#F5F5F5] uppercase tracking-wider mb-2">
                Latest Guest Wishes ({wishes.length})
              </h3>
              <div className="space-y-2">
                {wishes.slice(0, 3).map((w) => (
                  <div
                    key={w.id}
                    className="p-3 rounded-xl border border-[#ECECEC] dark:border-[#262626] bg-white dark:bg-[#141414]"
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-[#151515] dark:text-white">{w.authorNickname}</span>
                      <span className="text-[#888888]">{w.relationship}</span>
                    </div>
                    <p className="text-xs text-[#666666] dark:text-[#CCCCCC] line-clamp-2">{w.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Pending Photos List (Content Tab) */
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-[#151515] dark:text-[#F5F5F5] uppercase tracking-wider">
                Pending photos ({pendingPosts.length})
              </h3>
              {pendingPosts.length > 0 && (
                <button
                  onClick={() => {
                    if (selectedPostIds.length === pendingPosts.length) {
                      setSelectedPostIds([]);
                    } else {
                      setSelectedPostIds(pendingPosts.map((p) => p.id));
                    }
                  }}
                  className="text-xs text-[#A6475B] dark:text-[#FB7185] font-semibold"
                >
                  {selectedPostIds.length === pendingPosts.length ? "Deselect all" : "Select all"}
                </button>
              )}
            </div>

            {pendingPosts.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#666666] dark:text-[#888888] border border-dashed border-[#ECECEC] dark:border-[#262626] rounded-2xl">
                No pending uploads awaiting moderation.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {pendingPosts.map((post) => {
                  const isSelected = selectedPostIds.includes(post.id);
                  const thumbUrl = post.mediaItems?.[0]?.dataUrl || getMediaDataUrl(post.mediaIds[0]);

                  return (
                    <div
                      key={post.id}
                      onClick={() => handleToggleSelect(post.id)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer bg-stone-900 ${
                        isSelected ? "border-[#A6475B] dark:border-[#FB7185]" : "border-transparent"
                      }`}
                    >
                      {thumbUrl && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={thumbUrl} alt="Pending" className="w-full h-full object-cover" />
                      )}
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center text-xs">
                        {isSelected ? "✓" : ""}
                      </div>
                      <div className="absolute bottom-2 inset-x-2 text-white text-[10px] bg-black/60 rounded px-1.5 py-0.5 truncate">
                        {post.authorNickname}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bulk Action Footer */}
      {selectedPostIds.length > 0 && (
        <div className="p-4 bg-white dark:bg-[#121212] border-t border-[#ECECEC] dark:border-[#262626] flex items-center justify-between">
          <span className="text-xs font-semibold text-[#151515] dark:text-white">{selectedPostIds.length} selected</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                selectedPostIds.forEach((id) => rejectPost(id));
                setSelectedPostIds([]);
              }}
              className="px-3.5 py-2 border border-[#ECECEC] dark:border-[#262626] text-xs font-bold text-[#666666] dark:text-[#A0A0A0] rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600"
            >
              Reject
            </button>
            <button
              onClick={handleApproveSelected}
              className="px-5 py-2 bg-[#151515] dark:bg-white text-white dark:text-[#151515] text-xs font-bold rounded-xl hover:opacity-90"
            >
              Approve selected
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

