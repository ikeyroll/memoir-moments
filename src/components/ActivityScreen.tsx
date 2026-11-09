"use client";

import React from "react";
import { useMemoir } from "@/context/MemoirContext";
import { formatRelativeTime } from "@/lib/utils";

export function ActivityScreen() {
  const { activities, setIsActivityOpen, markAllActivitiesRead, getMediaDataUrl } = useMemoir();

  const todayActivities = activities.filter((a) => a.group === "today");
  const earlierActivities = activities.filter((a) => a.group === "earlier");

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-black text-[#151515] dark:text-[#F5F5F5] flex flex-col max-w-[430px] mx-auto animate-in slide-in-from-right duration-200">
      {/* Header: <, Activity, Mark all read */}
      <div className="px-4 py-3.5 border-b border-[#ECECEC] dark:border-[#262626] flex items-center justify-between">
        <button
          onClick={() => setIsActivityOpen(false)}
          className="text-sm font-semibold text-[#151515] dark:text-white p-1 hover:opacity-75"
        >
          ←
        </button>
        <h2 className="font-semibold text-sm text-[#151515] dark:text-[#F5F5F5]">Activity</h2>
        <button
          onClick={markAllActivitiesRead}
          className="text-xs text-[#A6475B] dark:text-[#FB7185] font-semibold hover:underline p-1"
        >
          Mark all read
        </button>
      </div>

      {/* Activity List: Today & Earlier */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Today Group */}
        <div>
          <h3 className="font-bold text-xs text-[#151515] dark:text-[#F5F5F5] uppercase tracking-wider mb-2.5">Today</h3>
          <div className="space-y-3">
            {todayActivities.map((act) => {
              const thumbUrl = act.thumbnailUrl;

              return (
                <div key={act.id} className="flex items-center justify-between space-x-3 py-1">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#F9ECEF] dark:bg-[#2D1B22] text-[#A6475B] dark:text-[#FB7185] flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {act.actorAvatarLetter}
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="text-[#151515] dark:text-[#E0E0E0] leading-snug">
                        <strong className="font-semibold text-[#151515] dark:text-white">{act.actorNickname}</strong> {act.message}
                      </p>
                      <span className="text-[10px] text-[#666666] dark:text-[#888888] font-mono">{formatRelativeTime(act.createdAt)}</span>
                    </div>
                  </div>

                  {thumbUrl && (
                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-stone-900 border border-[#ECECEC] dark:border-[#262626] flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={thumbUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Earlier Group */}
        <div className="pt-2 border-t border-[#ECECEC] dark:border-[#262626]">
          <h3 className="font-bold text-xs text-[#151515] dark:text-[#F5F5F5] uppercase tracking-wider mb-2.5">Earlier</h3>
          <div className="space-y-3">
            {earlierActivities.map((act) => {
              const thumbUrl = act.thumbnailUrl;

              return (
                <div key={act.id} className="flex items-center justify-between space-x-3 py-1">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#F8F8F8] dark:bg-[#1C1C1E] border border-[#ECECEC] dark:border-[#2C2C2E] text-[#151515] dark:text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {act.actorAvatarLetter}
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="text-[#151515] dark:text-[#E0E0E0] leading-snug">
                        <strong className="font-semibold text-[#151515] dark:text-white">{act.actorNickname}</strong> {act.message}
                      </p>
                      <span className="text-[10px] text-[#666666] dark:text-[#888888] font-mono">{formatRelativeTime(act.createdAt)}</span>
                    </div>
                  </div>

                  {thumbUrl && (
                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-stone-900 border border-[#ECECEC] dark:border-[#262626] flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={thumbUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

