"use client";

import React, { useState } from "react";
import { useMemoir } from "@/context/MemoirContext";
import { FeedPost } from "@/lib/types";

export function HighlightsAlbumScreen() {
  const { highlights, posts, weddingDetails, session, getMediaDataUrl, deleteHighlight, createHighlight } = useMemoir();
  const [selectedHighlightId, setSelectedHighlightId] = useState<string | null>(null);
  const [selectedPhotoPost, setSelectedPhotoPost] = useState<FeedPost | null>(null);
  const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");

  const approvedPosts = posts.filter((p) => p.status === "approved");

  // Selected highlight
  const activeHighlight = highlights.find((h) => h.id === selectedHighlightId);
  const highlightPosts = activeHighlight
    ? approvedPosts.filter((p) => p.highlightId === activeHighlight.id)
    : [];

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createHighlight(newTitle, newSubtitle, approvedPosts[0]?.mediaIds[0] || "media_nikah_1");
    setNewTitle("");
    setNewSubtitle("");
    setIsAddCollectionOpen(false);
  };

  return (
    <div className="min-h-[85dvh] bg-white dark:bg-black text-[#151515] dark:text-[#F5F5F5] max-w-[430px] mx-auto pb-20 transition-colors">
      {/* Screen 03: Title Our memories. Under it, a compact wedding label */}
      <div className="px-4 py-4 border-b border-[#ECECEC] dark:border-[#262626]">
        {selectedHighlightId ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setSelectedHighlightId(null);
                setSelectedPhotoPost(null);
              }}
              className="text-sm font-semibold text-[#666666] dark:text-[#A0A0A0] hover:text-[#151515] dark:hover:text-white flex items-center space-x-1"
            >
              <span>‹</span>
              <span>All memories</span>
            </button>
            <span className="text-[#666666] dark:text-[#A0A0A0]">•</span>
            <span className="text-sm font-bold text-[#151515] dark:text-[#F5F5F5]">{activeHighlight?.title}</span>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between">
              <h1 className="font-serif text-2xl font-bold tracking-tight text-[#151515] dark:text-[#F5F5F5]">
                Our memories
              </h1>
              {session?.role === "host" && (
                <button
                  onClick={() => setIsAddCollectionOpen(true)}
                  className="text-xs font-semibold text-[#A6475B] dark:text-[#FB7185] hover:underline"
                >
                  + Add collection
                </button>
              )}
            </div>
            <p className="text-xs text-[#666666] dark:text-[#A0A0A0] mt-0.5">
              {weddingDetails.coupleNames} • {weddingDetails.weddingDate}
            </p>
          </div>
        )}
      </div>

      {/* Add Collection Modal */}
      {isAddCollectionOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateCollection} className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-5 max-w-xs w-full shadow-xl space-y-3 border border-[#ECECEC] dark:border-[#262626]">
            <h3 className="font-bold text-sm text-[#151515] dark:text-[#F5F5F5]">New Memory Collection</h3>
            <input
              type="text"
              placeholder="Collection Title (e.g. Mehndi / Tea Ceremony)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 border border-[#ECECEC] dark:border-[#262626] rounded-xl text-xs bg-white dark:bg-[#121212] text-[#151515] dark:text-white"
              required
            />
            <input
              type="text"
              placeholder="Subtitle (e.g. Afternoon Celebrations)"
              value={newSubtitle}
              onChange={(e) => setNewSubtitle(e.target.value)}
              className="w-full px-3 py-2 border border-[#ECECEC] dark:border-[#262626] rounded-xl text-xs bg-white dark:bg-[#121212] text-[#151515] dark:text-white"
            />
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddCollectionOpen(false)}
                className="px-3 py-1.5 text-xs text-[#666666] dark:text-[#A0A0A0]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#151515] dark:bg-white text-white dark:text-[#151515] text-xs font-bold rounded-xl"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW A: 2-column photographic album grid: Nikah, Reception, Family, Friends */}
      {!selectedHighlightId && (
        <div className="p-4 grid grid-cols-2 gap-3.5">
          {highlights.map((hl) => {
            const count = approvedPosts.filter((p) => p.highlightId === hl.id).length;
            const coverUrl = getMediaDataUrl(hl.coverMediaId);

            return (
              <button
                key={hl.id}
                onClick={() => setSelectedHighlightId(hl.id)}
                className="group text-left relative aspect-[4/5] rounded-2xl overflow-hidden bg-stone-900 focus:outline-none shadow-sm border border-transparent dark:border-[#262626]"
              >
                {coverUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={coverUrl}
                    alt={hl.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-800 flex items-center justify-center text-white/50 text-xs font-bold">
                    {hl.title}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Readable Title and Actual Local Item Count */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-serif text-lg font-bold leading-tight drop-shadow">
                    {hl.title}
                  </h3>
                  <p className="text-[11px] text-white/80 font-medium">
                    {count} {count === 1 ? "memory" : "memories"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* VIEW B: Clean 3-column photo grid inside selected collection */}
      {selectedHighlightId && (
        <div className="p-1">
          {highlightPosts.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#666666] dark:text-[#888888]">
              No memories in this collection yet.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {highlightPosts.flatMap((post) =>
                post.mediaIds.map((mediaId, idx) => {
                  const url = getMediaDataUrl(mediaId);
                  return (
                    <button
                      key={`${post.id}_${mediaId}_${idx}`}
                      onClick={() => setSelectedPhotoPost(post)}
                      className="aspect-square bg-stone-900 overflow-hidden relative group focus:outline-none"
                    >
                      {url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={url} alt={post.caption || "Photo"} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-stone-800" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}

      {/* Fullscreen Photo Lightbox Modal */}
      {selectedPhotoPost && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4">
          <div className="flex items-center justify-between text-white pt-2">
            <div>
              <span className="font-semibold text-sm">{selectedPhotoPost.authorNickname}</span>
              <p className="text-xs text-white/70">{selectedPhotoPost.locationTag || weddingDetails.venueName}</p>
            </div>
            <button
              onClick={() => setSelectedPhotoPost(null)}
              className="text-white text-lg p-2 hover:opacity-75"
              aria-label="Close photo"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center my-4 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getMediaDataUrl(selectedPhotoPost.mediaIds[0])}
              alt="Memory"
              className="max-h-[75dvh] max-w-full object-contain rounded-lg"
            />
          </div>

          <div className="text-white text-xs max-w-sm mx-auto text-center pb-4">
            <p className="line-clamp-2">{selectedPhotoPost.caption}</p>
          </div>
        </div>
      )}
    </div>
  );
}

