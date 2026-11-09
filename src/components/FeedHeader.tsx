"use client";

import React, { useState } from "react";
import { useMemoir } from "@/context/MemoirContext";
import { HeartIcon } from "./RedesignIcons";

export function FeedHeader() {
  const {
    weddingDetails,
    setIsActivityOpen,
    setIsWeddingInfoSheetOpen,
    setIsWelcomeSplashOpen,
    activities,
    theme,
    toggleTheme,
    posts,
    highlights,
    feedSearchQuery: searchQuery,
    setFeedSearchQuery: setSearchQuery,
    feedHighlightFilter: selectedHighlightFilter,
    setFeedHighlightFilter: setSelectedHighlightFilter,
  } = useMemoir();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const unreadCount = activities.filter((a) => !a.read).length;

  const brideName = weddingDetails.brideName || weddingDetails.partnerOne || "Farah";

  // Filtered memories for search dropdown
  const filteredPosts = posts.filter((p) => {
    if (p.status !== "approved") return false;
    const matchesHighlight = selectedHighlightFilter === "all" || p.highlightId === selectedHighlightFilter;
    const matchesQuery =
      !searchQuery.trim() ||
      p.authorNickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.locationTag && p.locationTag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesHighlight && matchesQuery;
  });

  return (
    <>
      {/* =========================================================================
          FLORAL WEDDING HEADER (AS IN SPEC REFERENCE IMAGE)
          - Left: Delicate watercolor blush peonies, baby's breath & gold arching vines
          - Center: "Memories" cursive calligraphy with looped heart flourish
                    & "DIGITAL MEMORIES" subtitle with 4-point gold star dividers
          - Right: Luxury Search, Heart, Sparkle & Theme controls + Right florals
          - Fully responsive in Light mode & OLED Dark mode
         ========================================================================= */}
      <header className="sticky top-0 z-30 w-full max-w-[430px] mx-auto bg-[#FCFBF9] dark:bg-[#000000] border-b border-[#EDE6DC] dark:border-[#221C16] shadow-xs select-none transition-colors">
        <div className="relative h-16 sm:h-18 flex items-center justify-between px-2 overflow-hidden">
          
          {/* ================= LEFT FLORAL WATERCOLOR BOUQUET ================= */}
          <div className="relative w-16 sm:w-20 h-full flex items-center pointer-events-none flex-shrink-0">
            <svg
              className="w-full h-14 overflow-visible"
              viewBox="0 0 90 55"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Arching Gold Stem Line stretching to center */}
              <path
                d="M 5 45 C 25 15, 55 35, 90 28"
                stroke={theme === "dark" ? "#E5C282" : "#B88746"}
                strokeWidth="1.2"
                strokeLinecap="round"
                className="opacity-90 drop-shadow-xs"
              />
              <path
                d="M 2 35 C 18 20, 38 28, 60 22"
                stroke={theme === "dark" ? "#D9B167" : "#C79A5B"}
                strokeWidth="0.8"
                strokeLinecap="round"
                opacity="0.7"
              />

              {/* Sage Leaves */}
              <path d="M 12 36 C 8 28, 16 22, 22 27 C 18 33, 14 36, 12 36 Z" fill="#9FB098" opacity="0.85" />
              <path d="M 28 26 C 24 18, 33 14, 38 19 C 34 24, 30 26, 28 26 Z" fill="#84987E" opacity="0.8" />
              <path d="M 44 32 C 40 25, 48 20, 53 24 C 50 30, 46 32, 44 32 Z" fill="#9FB098" opacity="0.75" />

              {/* Blush Peony / Rose Blossom */}
              <g transform="translate(-2, 10)">
                <circle cx="16" cy="18" r="14" fill="#F4BAC3" opacity="0.9" />
                <circle cx="14" cy="16" r="10.5" fill="#ECA1AC" opacity="0.85" />
                <circle cx="18" cy="19" r="7.5" fill="#D46A7E" opacity="0.8" />
                <circle cx="15" cy="17" r="4.5" fill="#A6475B" opacity="0.9" />
                <circle cx="16" cy="18" r="2.5" fill="#8C3547" />
              </g>

              {/* Secondary Rose Bud */}
              <circle cx="2" cy="18" r="7" fill="#F8C9D1" opacity="0.85" />
              <circle cx="3" cy="17" r="4" fill="#ECA1AC" opacity="0.9" />

              {/* Gypsophila (White Baby's Breath) */}
              <circle cx="34" cy="15" r="2.2" fill="#FFFFFF" stroke="#D9B167" strokeWidth="0.5" />
              <circle cx="42" cy="10" r="1.8" fill="#FFFFFF" stroke="#D9B167" strokeWidth="0.5" />
              <circle cx="50" cy="18" r="2" fill="#FFFFFF" stroke="#D9B167" strokeWidth="0.5" />
              <circle cx="28" cy="8" r="1.6" fill="#FFFFFF" stroke="#D9B167" strokeWidth="0.5" />
            </svg>
          </div>

          {/* ================= CENTER "MEMORIES" CALLIGRAPHY WORDMARK ================= */}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-1 z-10">
            {/* Center Calligraphy & Star Flourish Row */}
            <div className="flex items-center justify-center space-x-1.5 sm:space-x-2">
              {/* Left Gold Star & Line */}
              <div className="flex items-center space-x-1 opacity-80">
                <span className="w-3 sm:w-5 h-[1px] bg-gradient-to-r from-transparent to-[#B88746] dark:to-[#E5C282]" />
                <span className="text-[10px] sm:text-xs text-[#B88746] dark:text-[#E5C282] font-serif">✦</span>
              </div>

              {/* Calligraphy "Memories" with Attached Heart Flourish */}
              <button
                type="button"
                onClick={() => setIsWelcomeSplashOpen(true)}
                className="group inline-flex items-center focus:outline-none cursor-pointer"
                title={`Welcome Invitation • Wedding of ${brideName}`}
              >
                <span className="font-serif italic text-2xl sm:text-[27px] font-bold tracking-tight bg-gradient-to-r from-[#B88746] via-[#9E6D2B] to-[#7E521C] dark:from-[#FFE4A3] dark:via-[#F3CB7E] dark:to-[#D4A24B] bg-clip-text text-transparent group-hover:opacity-90 transition-opacity drop-shadow-[0_1px_1px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_0_8px_rgba(243,203,126,0.35)]">
                  Memories
                </span>

                {/* Looped Heart Flourish attached to the 's' */}
                <svg
                  className="w-4 h-4 ml-0.5 text-[#B88746] dark:text-[#E5C282] -mt-1 group-hover:scale-110 transition-transform drop-shadow-xs"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                </svg>
              </button>

              {/* Right Gold Star & Line */}
              <div className="flex items-center space-x-1 opacity-80">
                <span className="text-[10px] sm:text-xs text-[#B88746] dark:text-[#E5C282] font-serif">✦</span>
                <span className="w-3 sm:w-5 h-[1px] bg-gradient-to-l from-transparent to-[#B88746] dark:to-[#E5C282]" />
              </div>
            </div>

            {/* Subtitle: "D I G I T A L   M E M O R I E S" */}
            <button
              type="button"
              onClick={() => setIsWeddingInfoSheetOpen(true)}
              className="text-[8px] sm:text-[9px] uppercase font-serif font-semibold tracking-[0.32em] text-[#8C6F47] dark:text-[#D5B57A] -mt-0.5 hover:opacity-80 transition-opacity"
            >
              DIGITAL MEMORIES
            </button>
          </div>

          {/* ================= RIGHT ACTION ICONS & FLORAL BOUQUET ================= */}
          <div className="relative flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0 z-10">
            {/* 1. Search Icon (Magnifying Glass) */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-1 text-[#7A5B2B] dark:text-[#E5C282] hover:opacity-80 active:scale-90 transition-all ${
                isSearchOpen ? "bg-[#B88746]/15 rounded-full" : ""
              }`}
              aria-label="Search memories"
              title="Search memories"
            >
              <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            {/* 2. Heart Icon (Activity Notifications) */}
            <button
              type="button"
              onClick={() => setIsActivityOpen(true)}
              className="relative p-1 text-[#7A5B2B] dark:text-[#E5C282] hover:opacity-80 active:scale-90 transition-all"
              aria-label="Open activity"
              title="Activity"
            >
              <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#A6475B] dark:bg-[#FB7185] ring-1 ring-white dark:ring-black animate-pulse" />
              )}
            </button>

            {/* 3. Sparkle Icon (Welcome Invitation Splash) */}
            <button
              type="button"
              onClick={() => setIsWelcomeSplashOpen(true)}
              className="p-1 text-[#7A5B2B] dark:text-[#E5C282] hover:opacity-80 active:scale-90 transition-all"
              aria-label="Welcome Invitation"
              title="Welcome Invitation"
            >
              <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </button>

            {/* 4. One-Tap Theme Toggle (Sun / Moon) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1 text-[#7A5B2B] dark:text-[#E5C282] hover:opacity-80 active:scale-90 transition-all ml-0.5"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? (
                <svg className="w-4 h-4 text-amber-300 drop-shadow-[0_0_6px_rgba(252,211,77,0.8)]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-[#7A5B2B]" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>

            {/* Right Floral Bouquet Decoration */}
            <div className="w-8 sm:w-10 h-full flex items-center pointer-events-none opacity-85">
              <svg className="w-full h-12 overflow-visible" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0 20 C 15 25, 25 15, 40 30" stroke={theme === "dark" ? "#E5C282" : "#B88746"} strokeWidth="1" strokeLinecap="round" />
                <path d="M 12 14 C 18 10, 26 12, 23 18 C 18 18, 14 16, 12 14 Z" fill="#9FB098" opacity="0.8" />
                <circle cx="28" cy="20" r="10" fill="#F4BAC3" opacity="0.85" />
                <circle cx="26" cy="19" r="6" fill="#D46A7E" opacity="0.8" />
                <circle cx="38" cy="12" r="1.8" fill="#FFFFFF" stroke="#D9B167" strokeWidth="0.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* ================= SEARCH & ALBUM FILTER POP-DOWN ================= */}
        {isSearchOpen && (
          <div className="p-3 bg-white dark:bg-[#12100E] border-t border-[#EDE6DC] dark:border-[#221C16] animate-in slide-in-from-top-2 duration-150">
            {/* Search Input Bar */}
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search memories by guest, caption, or place..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-8 py-1.5 text-xs bg-[#F8F6F2] dark:bg-[#1C1814] border border-[#E0D7CB] dark:border-[#2E251A] rounded-full text-[#151515] dark:text-[#F5EFE6] focus:outline-none focus:border-[#B88746] placeholder:text-[#999999]"
                autoFocus
              />
              <span className="absolute left-2.5 text-xs text-[#888888]">🔍</span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 text-xs text-[#888888] font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Highlight Filter Chips */}
            <div className="flex items-center space-x-1.5 mt-2 overflow-x-auto no-scrollbar py-0.5">
              <button
                type="button"
                onClick={() => setSelectedHighlightFilter("all")}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  selectedHighlightFilter === "all"
                    ? "bg-[#A6475B] text-white"
                    : "bg-[#F4EFEA] dark:bg-[#1E1914] text-[#666666] dark:text-[#A0A0A0]"
                }`}
              >
                All Memories
              </button>
              {highlights.map((hl) => (
                <button
                  key={hl.id}
                  type="button"
                  onClick={() => setSelectedHighlightFilter(hl.id)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors ${
                    selectedHighlightFilter === hl.id
                      ? "bg-[#A6475B] text-white"
                      : "bg-[#F4EFEA] dark:bg-[#1E1914] text-[#666666] dark:text-[#A0A0A0]"
                  }`}
                >
                  {hl.title}
                </button>
              ))}
            </div>

            {/* Quick Match Count */}
            <div className="text-[10px] text-[#888888] mt-1.5 text-right font-mono">
              {filteredPosts.length} {filteredPosts.length === 1 ? "memory found" : "memories found"}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
