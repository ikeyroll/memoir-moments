"use client";

import React from "react";
import { useMemoir } from "@/context/MemoirContext";

export function GuestStoriesTray() {
  const {
    stories,
    session,
    setActiveStoryId,
    openCreateMemory,
    getMediaDataUrl,
  } = useMemoir();

  // Find if current user has an uploaded story
  const myStories = stories.filter((s) => s.authorNickname === session?.nickname);
  const myLatestStory = myStories[0];
  const myMediaUrl = myLatestStory ? (myLatestStory.mediaItem?.dataUrl || getMediaDataUrl(myLatestStory.mediaId)) : null;

  // Other guests' stories
  const otherStories = stories.filter((s) => s.authorNickname !== session?.nickname);

  return (
    <div className="py-3 border-b border-[#ECECEC] dark:border-[#262626] bg-white dark:bg-black transition-colors">
      <div className="flex items-center space-x-3.5 overflow-x-auto no-scrollbar px-4">
        {/* "Your story" with Instagram live state */}
        <div className="flex flex-col items-center flex-shrink-0 group">
          <div className="relative">
            {myLatestStory ? (
              /* User has an active story: Glowing rose ring with preview */
              <button
                type="button"
                onClick={() => setActiveStoryId(myLatestStory.id)}
                className="w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-[#A6475B] via-[#D17B8E] to-[#A6475B] transition-transform active:scale-95 focus:outline-none"
                aria-label="View your story"
              >
                <div className="w-full h-full rounded-full p-[1.5px] bg-white dark:bg-black">
                  <div className="w-full h-full rounded-full overflow-hidden bg-stone-900 flex items-center justify-center">
                    {myMediaUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={myMediaUrl} alt="Your story" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-xs text-white">
                        {session ? session.nickname.slice(0, 2).toUpperCase() : "ME"}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ) : (
              /* User has no story yet: Tap to add */
              <button
                type="button"
                onClick={() => openCreateMemory("story")}
                className="w-16 h-16 rounded-full p-[2px] border-2 border-dashed border-[#ECECEC] dark:border-[#383838] hover:border-[#A6475B] transition-colors focus:outline-none flex items-center justify-center bg-[#F8F8F8] dark:bg-[#1A1A1A]"
                aria-label="Add to your story"
              >
                <span className="font-bold text-xs text-[#151515] dark:text-white">
                  {session ? session.nickname.slice(0, 2).toUpperCase() : "ME"}
                </span>
              </button>
            )}

            {/* Plus badge (Add another story) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openCreateMemory("story");
              }}
              className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#A6475B] hover:bg-[#8e3a4c] text-white flex items-center justify-center font-bold text-xs border-2 border-white dark:border-black shadow-sm transition-transform active:scale-90"
              aria-label="Upload new story"
            >
              +
            </button>
          </div>
          <span className="text-[11px] font-medium text-[#151515] dark:text-[#E0E0E0] mt-1.5 truncate max-w-[72px]">
            Your story
          </span>
        </div>

        {/* Guest stories: recent stories have rose ring (#A6475B); watched stories use grey */}
        {otherStories.map((story) => {
          const isSeen = session ? story.seenByNicknames.includes(session.nickname) : false;
          const mediaUrl = story.mediaItem?.dataUrl || getMediaDataUrl(story.mediaId);

          return (
            <button
              key={story.id}
              onClick={() => setActiveStoryId(story.id)}
              className="flex flex-col items-center flex-shrink-0 group focus:outline-none"
              aria-label={`View ${story.authorNickname}'s story`}
            >
              <div
                className={`w-16 h-16 rounded-full p-[2.5px] transition-transform active:scale-95 group-hover:scale-105 ${
                  isSeen
                    ? "border-2 border-[#ECECEC] dark:border-[#383838] p-[1.5px]"
                    : "bg-gradient-to-tr from-[#A6475B] via-[#D17B8E] to-[#A6475B]"
                }`}
              >
                <div className="w-full h-full rounded-full p-[1.5px] bg-white dark:bg-black">
                  <div className="w-full h-full rounded-full overflow-hidden bg-stone-900 flex items-center justify-center">
                    {mediaUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={mediaUrl} alt={story.authorNickname} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-xs text-white">
                        {story.authorNickname.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-medium text-[#151515] dark:text-[#E0E0E0] mt-1.5 truncate max-w-[72px]">
                {story.authorNickname}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

