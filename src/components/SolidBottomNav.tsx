"use client";

import React from "react";
import {
  NavHomeIcon,
  NavHighlightsIcon,
  NavAddIcon,
  NavWishesIcon,
  NavProfileIcon,
} from "./RedesignIcons";
import { useMemoir } from "@/context/MemoirContext";

interface SolidBottomNavProps {
  currentTab: "feed" | "highlights" | "add" | "wishes" | "profile";
  onTabChange: (tab: "feed" | "highlights" | "add" | "wishes" | "profile") => void;
}

export function SolidBottomNav({ currentTab, onTabChange }: SolidBottomNavProps) {
  const { openCreateMemory } = useMemoir();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30 bg-white dark:bg-black border-t border-[#ECECEC] dark:border-[#262626] h-[58px] pb-[env(safe-area-inset-bottom)] max-w-[430px] mx-auto w-full transition-colors select-none"
      aria-label="App Navigation"
    >
      <div className="flex items-center justify-around h-full px-2">
        {/* 1. Home */}
        <button
          onClick={() => onTabChange("feed")}
          className={`flex flex-col items-center justify-center w-14 h-full focus:outline-none ${
            currentTab === "feed"
              ? "text-[#151515] dark:text-white"
              : "text-[#666666] dark:text-[#888888] hover:text-[#151515] dark:hover:text-white"
          }`}
          aria-label="Home"
        >
          <NavHomeIcon active={currentTab === "feed"} />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Home</span>
        </button>

        {/* 2. Highlights (Stacked Photo Icon) */}
        <button
          onClick={() => onTabChange("highlights")}
          className={`flex flex-col items-center justify-center w-14 h-full focus:outline-none ${
            currentTab === "highlights"
              ? "text-[#151515] dark:text-white"
              : "text-[#666666] dark:text-[#888888] hover:text-[#151515] dark:hover:text-white"
          }`}
          aria-label="Highlights"
        >
          <NavHighlightsIcon active={currentTab === "highlights"} />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Highlights</span>
        </button>

        {/* 3. Add (Center Action - labelled Add rather than Plus per section 21) */}
        <button
          onClick={() => openCreateMemory("post")}
          className="flex flex-col items-center justify-center w-14 h-full text-[#151515] dark:text-white hover:opacity-75 focus:outline-none"
          aria-label="Add new memory"
        >
          <NavAddIcon />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Add</span>
        </button>

        {/* 4. Wishes */}
        <button
          onClick={() => onTabChange("wishes")}
          className={`flex flex-col items-center justify-center w-14 h-full focus:outline-none ${
            currentTab === "wishes"
              ? "text-[#A6475B] dark:text-[#FB7185]"
              : "text-[#666666] dark:text-[#888888] hover:text-[#151515] dark:hover:text-white"
          }`}
          aria-label="Wishes"
        >
          <NavWishesIcon active={currentTab === "wishes"} />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Wishes</span>
        </button>

        {/* 5. Profile */}
        <button
          onClick={() => onTabChange("profile")}
          className={`flex flex-col items-center justify-center w-14 h-full focus:outline-none ${
            currentTab === "profile"
              ? "text-[#151515] dark:text-white"
              : "text-[#666666] dark:text-[#888888] hover:text-[#151515] dark:hover:text-white"
          }`}
          aria-label="Profile"
        >
          <NavProfileIcon active={currentTab === "profile"} />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Profile</span>
        </button>
      </div>
    </nav>
  );
}

