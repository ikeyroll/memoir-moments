"use client";

import React, { useState } from "react";
import { useMemoir } from "@/context/MemoirContext";
import { FeedPost } from "@/lib/types";

export function ProfileScreen() {
  const { session, posts, wishes, getMediaDataUrl, updateProfile, switchDemoRole, setIsHostStudioOpen, setIsWeddingSettingsOpen } = useMemoir();
  const [profileTab, setProfileTab] = useState<"photos" | "stories" | "saved">("photos");
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(session?.nickname || "");
  const [editBio, setEditBio] = useState(session?.bio || "");
  const [selectedPost, setSelectedPost] = useState<FeedPost | null>(null);

  if (!session) return null;

  // Filter user's published photos
  const userPosts = posts.filter(
    (p) => p.authorNickname.toLowerCase() === session.nickname.toLowerCase() && p.status === "approved"
  );
  const userPendingPosts = posts.filter(
    (p) => p.authorNickname.toLowerCase() === session.nickname.toLowerCase() && p.status === "pending"
  );
  const savedPosts = posts.filter((p) => session.savedPostIds.includes(p.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    updateProfile(editName, editBio);
    setIsEditing(false);
  };

  return (
    <div className="min-h-[85dvh] bg-white dark:bg-black text-[#151515] dark:text-[#F5F5F5] max-w-[430px] mx-auto pb-20 transition-colors">
      {/* Screen 04 Profile Header */}
      <div className="p-4 border-b border-[#ECECEC] dark:border-[#262626]">
        <div className="flex items-center space-x-5">
          {/* Avatar with subtle rose border */}
          <div className="w-18 h-18 rounded-full p-[2px] bg-gradient-to-tr from-[#A6475B] to-[#D17B8E] flex-shrink-0">
            <div className="w-full h-full rounded-full bg-white dark:bg-black p-[2px]">
              <div className="w-full h-full rounded-full bg-[#F8F8F8] dark:bg-[#1C1C1E] flex items-center justify-center font-bold text-xl text-[#A6475B] dark:text-[#FB7185]">
                {session.nickname.slice(0, 2).toUpperCase()}
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-base text-[#151515] dark:text-[#F5F5F5] truncate">{session.nickname}</h1>
              <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full font-bold ${
                session.role === "host"
                  ? "bg-[#151515] dark:bg-white text-white dark:text-[#151515]"
                  : "bg-[#F8F8F8] dark:bg-[#1C1C1E] text-[#666666] dark:text-[#A0A0A0]"
              }`}>
                {session.role === "host" ? "Wedding Host" : "Guest"}
              </span>
            </div>

            {/* Contributions count */}
            <p className="text-xs text-[#666666] dark:text-[#A0A0A0] mt-0.5">
              {userPosts.length} photos shared • {wishes.filter((w) => w.authorNickname === session.nickname).length} wishes
            </p>

            {/* Short Bio */}
            <p className="text-xs text-[#151515] dark:text-[#E0E0E0] mt-1 line-clamp-2">
              {session.bio || "Guest celebrating Farah & Daniyal's wedding!"}
            </p>
          </div>
        </div>

        {/* Action Buttons: Edit profile & Host Studio / Demo Switch */}
        <div className="flex items-center space-x-2 mt-4">
          <button
            onClick={() => {
              setEditName(session.nickname);
              setEditBio(session.bio || "");
              setIsEditing(true);
            }}
            className="flex-1 py-1.5 bg-[#F8F8F8] dark:bg-[#1C1C1E] hover:bg-[#ECECEC] dark:hover:bg-[#2C2C2E] text-[#151515] dark:text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Edit profile
          </button>

          {session.role === "host" ? (
            <button
              onClick={() => setIsHostStudioOpen(true)}
              className="px-3 py-1.5 bg-[#151515] dark:bg-white text-white dark:text-[#151515] rounded-xl text-xs font-semibold hover:opacity-90 transition-colors"
            >
              Host Studio
            </button>
          ) : (
            <button
              onClick={() => switchDemoRole("host")}
              className="px-3 py-1.5 border border-[#ECECEC] dark:border-[#262626] text-[#666666] dark:text-[#A0A0A0] hover:text-[#151515] dark:hover:text-white rounded-xl text-xs font-medium"
              title="Demo switcher for testing host controls"
            >
              Demo: Switch to Host
            </button>
          )}

          {session.role === "host" && (
            <button
              onClick={() => switchDemoRole("guest")}
              className="px-2.5 py-1.5 text-xs text-[#666666] dark:text-[#A0A0A0] hover:text-[#151515] dark:hover:text-white"
              title="Switch back to guest role"
            >
              As Guest
            </button>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveProfile} className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-5 max-w-xs w-full shadow-xl space-y-3 border border-[#ECECEC] dark:border-[#262626]">
            <h3 className="font-bold text-sm text-[#151515] dark:text-[#F5F5F5]">Edit Participant Profile</h3>
            <div>
              <label className="text-[11px] font-semibold text-[#666666] dark:text-[#A0A0A0]">Nickname</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 border border-[#ECECEC] dark:border-[#262626] rounded-xl text-xs mt-0.5 bg-white dark:bg-[#121212] text-[#151515] dark:text-white"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#666666] dark:text-[#A0A0A0]">Short Bio</label>
              <textarea
                rows={2}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full px-3 py-2 border border-[#ECECEC] dark:border-[#262626] rounded-xl text-xs mt-0.5 bg-white dark:bg-[#121212] text-[#151515] dark:text-white resize-none"
              />
            </div>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-xs text-[#666666] dark:text-[#A0A0A0]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#151515] dark:bg-white text-white dark:text-[#151515] text-xs font-bold rounded-xl"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pending Section visible only to the uploader / demo host */}
      {userPendingPosts.length > 0 && (
        <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/40 text-xs">
          <span className="font-semibold text-amber-900 dark:text-amber-300 block">Pending Host Approval ({userPendingPosts.length})</span>
          <p className="text-amber-800 dark:text-amber-400 text-[11px]">Your upload is awaiting host approval before appearing in the public feed.</p>
        </div>
      )}

      {/* Profile Tabs: Photos / Stories / Saved */}
      <div className="flex items-center justify-around border-b border-[#ECECEC] dark:border-[#262626] text-xs font-semibold bg-white dark:bg-black">
        <button
          onClick={() => setProfileTab("photos")}
          className={`flex-1 py-3 border-b-2 text-center transition-colors ${
            profileTab === "photos"
              ? "border-[#151515] dark:border-white text-[#151515] dark:text-white"
              : "border-transparent text-[#666666] dark:text-[#888888]"
          }`}
        >
          Photos ({userPosts.length})
        </button>
        <button
          onClick={() => setProfileTab("saved")}
          className={`flex-1 py-3 border-b-2 text-center transition-colors ${
            profileTab === "saved"
              ? "border-[#151515] dark:border-white text-[#151515] dark:text-white"
              : "border-transparent text-[#666666] dark:text-[#888888]"
          }`}
        >
          Saved ({savedPosts.length})
        </button>
      </div>

      {/* Grid Content */}
      <div className="p-1">
        {profileTab === "photos" && (
          userPosts.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#666666]">
              You haven&apos;t shared any wedding photos yet.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {userPosts.flatMap((post) =>
                post.mediaIds.map((mediaId, idx) => {
                  const url = getMediaDataUrl(mediaId);
                  return (
                    <button
                      key={`${post.id}_${mediaId}_${idx}`}
                      onClick={() => setSelectedPost(post)}
                      className="aspect-square bg-stone-900 overflow-hidden relative"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="Photo" className="w-full h-full object-cover" />
                    </button>
                  );
                })
              )}
            </div>
          )
        )}

        {profileTab === "saved" && (
          savedPosts.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#666666]">
              No saved memories yet. Tap the bookmark icon on any post in the feed.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {savedPosts.flatMap((post) =>
                post.mediaIds.map((mediaId, idx) => {
                  const url = getMediaDataUrl(mediaId);
                  return (
                    <button
                      key={`${post.id}_${mediaId}_${idx}`}
                      onClick={() => setSelectedPost(post)}
                      className="aspect-square bg-stone-900 overflow-hidden relative"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="Photo" className="w-full h-full object-cover" />
                    </button>
                  );
                })
              )}
            </div>
          )
        )}
      </div>

      {/* Lightbox Viewer */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4">
          <div className="flex items-center justify-between text-white">
            <span className="font-semibold text-sm">{selectedPost.authorNickname}</span>
            <button onClick={() => setSelectedPost(null)} className="text-white text-lg p-2">✕</button>
          </div>
          <div className="flex-1 flex items-center justify-center my-4 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getMediaDataUrl(selectedPost.mediaIds[0])} alt="Memory" className="max-h-[75dvh] object-contain rounded-lg" />
          </div>
          <p className="text-white text-xs text-center line-clamp-2 max-w-sm mx-auto">{selectedPost.caption}</p>
        </div>
      )}
    </div>
  );
}

