"use client";

import React, { useState } from "react";
import { MemoirProvider, useMemoir } from "@/context/MemoirContext";
import { JoinScreen } from "@/components/JoinScreen";
import { FeedHeader } from "@/components/FeedHeader";
import { GuestStoriesTray } from "@/components/GuestStoriesTray";
import { RedesignPostCard } from "@/components/RedesignPostCard";
import { HighlightsAlbumScreen } from "@/components/HighlightsAlbumScreen";
import { WishesScreen } from "@/components/WishesScreen";
import { ProfileScreen } from "@/components/ProfileScreen";
import { SolidBottomNav } from "@/components/SolidBottomNav";
import { CreateMemoryFlow } from "@/components/CreateMemoryFlow";
import { RedesignStoryViewer } from "@/components/RedesignStoryViewer";
import { ActivityScreen } from "@/components/ActivityScreen";
import { HostStudioScreen } from "@/components/HostStudioScreen";
import { WeddingSettingsScreen } from "@/components/WeddingSettingsScreen";
import { WeddingInfoSheet } from "@/components/WeddingInfoSheet";
import { WelcomeInvitationSplash } from "@/components/WelcomeInvitationSplash";

function MemoirApp() {
  const {
    session,
    isLoading,
    posts,
    highlights,
    currentNavTab,
    setCurrentNavTab,
    isActivityOpen,
    isHostStudioOpen,
    isWeddingSettingsOpen,
    feedSearchQuery,
    setFeedSearchQuery,
    feedHighlightFilter,
    setFeedHighlightFilter,
  } = useMemoir();

  // If user has not joined yet, display Screen 01 Join Screen
  const [hasEnteredJoin, setHasEnteredJoin] = useState(true);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[100dvh] bg-white text-[#151515]">
        <div className="w-10 h-10 border-2 border-[#A6475B] border-t-transparent rounded-full animate-spin mb-3" />
        <span className="font-serif italic font-bold text-xl text-[#A6475B]">
          Memoir
        </span>
      </div>
    );
  }

  // Screen 01: Join the wedding gate
  if (!session || !hasEnteredJoin) {
    return <JoinScreen onEnter={() => setHasEnteredJoin(true)} />;
  }

  const approvedPosts = posts.filter((p) => {
    if (p.status !== "approved") return false;
    const matchesHighlight = feedHighlightFilter === "all" || p.highlightId === feedHighlightFilter;
    const q = feedSearchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      p.authorNickname.toLowerCase().includes(q) ||
      p.caption.toLowerCase().includes(q) ||
      (p.locationTag && p.locationTag.toLowerCase().includes(q));
    return matchesHighlight && matchesQuery;
  });

  const isFiltered = feedHighlightFilter !== "all" || Boolean(feedSearchQuery.trim());

  return (
    <div className="min-h-dvh w-full max-w-[430px] mx-auto flex flex-col bg-white dark:bg-black text-[#151515] dark:text-[#F5F5F5] relative shadow-sm border-x border-[#ECECEC] dark:border-[#262626] overflow-x-hidden">
      {/* SCREEN 02: FEED */}
      {currentNavTab === "feed" && (
        <main className="flex-1 flex flex-col pb-16">
          {/* Header: Memoir wordmark left; heart Activity button right */}
          <FeedHeader />

          {/* Horizontal tray of current guest stories */}
          <GuestStoriesTray />

          {/* Chronological Photo Posts Feed */}
          <div className="flex-1">
            {isFiltered && (
              <div className="px-4 py-2 bg-[#FBF9F5] dark:bg-[#141210] border-b border-[#EDE6DC] dark:border-[#221C16] flex items-center justify-between text-xs">
                <span className="text-[#666666] dark:text-[#A0A0A0]">
                  Showing <strong className="text-[#151515] dark:text-white">{approvedPosts.length}</strong>{" "}
                  {feedHighlightFilter !== "all"
                    ? `in ${highlights.find((h) => h.id === feedHighlightFilter)?.title || "Album"}`
                    : "filtered memories"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setFeedSearchQuery("");
                    setFeedHighlightFilter("all");
                  }}
                  className="text-[#A6475B] dark:text-[#FB7185] font-semibold hover:underline"
                >
                  Clear filter
                </button>
              </div>
            )}
            {approvedPosts.length === 0 ? (
              <div className="py-20 text-center text-xs text-[#666666] px-4">
                {isFiltered
                  ? "No memories match your search or album filter."
                  : "No memories published yet. Tap Add below to share the first wedding photo!"}
              </div>
            ) : (
              approvedPosts.map((post) => (
                <RedesignPostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </main>
      )}

      {/* SCREEN 03: HIGHLIGHTS & ALBUM */}
      {currentNavTab === "highlights" && (
        <main className="flex-1 pb-16">
          <HighlightsAlbumScreen />
        </main>
      )}

      {/* SCREEN 09: WISHES GUESTBOOK */}
      {currentNavTab === "wishes" && (
        <main className="flex-1 pb-16">
          <WishesScreen />
        </main>
      )}

      {/* SCREEN 04: PROFILE */}
      {currentNavTab === "profile" && (
        <main className="flex-1 pb-16">
          <ProfileScreen />
        </main>
      )}

      {/* Solid 58px White Bottom Navigation Bar */}
      <SolidBottomNav
        currentTab={currentNavTab}
        onTabChange={(tab) => {
          if (tab !== "add") {
            setCurrentNavTab(tab);
          }
        }}
      />

      {/* Creation & Editor Flow (Screens 05, 06, 07) */}
      <CreateMemoryFlow />

      {/* Fullscreen Story Viewer (Screen 08) */}
      <RedesignStoryViewer />

      {/* Activity Drawer (Screen 10) */}
      {isActivityOpen && <ActivityScreen />}

      {/* Host Studio (Screen 11) */}
      {isHostStudioOpen && <HostStudioScreen />}

      {/* Wedding Settings (Screen 12) */}
      {isWeddingSettingsOpen && <WeddingSettingsScreen />}

      {/* Wedding Details Sheet */}
      <WeddingInfoSheet />

      {/* Luxury Welcome Invitation Splash Screen */}
      <WelcomeInvitationSplash />
    </div>
  );
}

export default function Home() {
  return (
    <MemoirProvider>
      <MemoirApp />
    </MemoirProvider>
  );
}
