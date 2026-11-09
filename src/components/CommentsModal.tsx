"use client";

import React, { useState, useRef, useEffect } from "react";
import { PostComment } from "@/lib/commentsData";
import { formatRelativeTime } from "@/lib/utils";

// Curated high-energy wedding celebration GIFs
const WEDDING_GIFS = [
  { id: "g1", title: "Champagne Cheers", category: "Cheers", url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=360&auto=format&fit=crop&q=80" },
  { id: "g2", title: "Confetti Celebration", category: "Confetti", url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=360&auto=format&fit=crop&q=80" },
  { id: "g3", title: "Eternal Rings", category: "Love", url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=360&auto=format&fit=crop&q=80" },
  { id: "g4", title: "Wedding Cheers", category: "Cheers", url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=360&auto=format&fit=crop&q=80" },
  { id: "g5", title: "Sparklers Sendoff", category: "Party", url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=360&auto=format&fit=crop&q=80" },
  { id: "g6", title: "Bridal Bouquet", category: "Love", url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=360&auto=format&fit=crop&q=80" },
  { id: "g7", title: "Happy Dance", category: "Party", url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=360&auto=format&fit=crop&q=80" },
  { id: "g8", title: "Tiered Cake Cheers", category: "Cheers", url: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=360&auto=format&fit=crop&q=80" },
];

const EXTENDED_EMOJIS = [
  "❤️", "🙌", "🥂", "🥹", "✨", "💍", "🎉", "👏",
  "🍾", "👰", "🤵", "💐", "🕊️", "🤍", "💖", "🍰",
  "🔥", "🥰", "🥳", "💫", "🌸", "💌", "💃", "🕺"
];

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  postAuthor: string;
  postCaption: string;
  postTime: string;
  comments: PostComment[];
  onAddComment: (text: string, gifUrl?: string) => void;
  onToggleLikeComment?: (commentId: string) => void;
  currentUserNickname: string;
}

export function CommentsModal({
  isOpen,
  onClose,
  postAuthor,
  postCaption,
  postTime,
  comments,
  onAddComment,
  onToggleLikeComment,
  currentUserNickname,
}: CommentsModalProps) {
  const [commentText, setCommentText] = useState("");
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showAllEmojis, setShowAllEmojis] = useState(false);
  const [gifCategory, setGifCategory] = useState<string>("All");
  const [gifSearch, setGifSearch] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setShowGifPicker(false);
      setShowAllEmojis(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(commentText.trim());
    setCommentText("");
    setShowGifPicker(false);
    setShowAllEmojis(false);
  };

  const handleSelectGif = (gifUrl: string) => {
    onAddComment(commentText.trim(), gifUrl);
    setCommentText("");
    setShowGifPicker(false);
  };

  const handleReply = (nickname: string) => {
    setCommentText(`@${nickname} `);
    inputRef.current?.focus();
  };

  const filteredGifs = WEDDING_GIFS.filter((g) => {
    const matchesCategory = gifCategory === "All" || g.category === gifCategory;
    const matchesSearch = !gifSearch.trim() || g.title.toLowerCase().includes(gifSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center animate-in fade-in-0 duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Comments"
    >
      {/* Instagram Bottom Sheet */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-[#121212] w-full max-w-[430px] rounded-t-[20px] shadow-2xl flex flex-col h-[75dvh] max-h-[660px] overflow-hidden animate-in slide-in-from-bottom duration-200"
      >
        {/* Drag Handle & Header */}
        <div className="pt-2.5 pb-2.5 border-b border-[#ECECEC] dark:border-[#262626] flex flex-col items-center relative bg-white dark:bg-[#121212]">
          <div className="w-9 h-1 bg-[#D1D1D1] dark:bg-[#383838] rounded-full mb-2" />
          <h3 className="font-semibold text-sm text-[#151515] dark:text-[#F5F5F5]">Comments</h3>
          <button
            onClick={onClose}
            className="absolute right-4 top-2.5 text-[#151515] dark:text-[#F5F5F5] p-1 text-base font-bold active:opacity-60"
            aria-label="Close comments"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Comments Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-white dark:bg-[#121212]">
          {/* Post Author Caption as Pinned First Item */}
          {postCaption && (
            <div className="flex items-start space-x-3 pb-3.5 border-b border-[#ECECEC] dark:border-[#262626]">
              <div className="w-8 h-8 rounded-full bg-[#F9ECEF] dark:bg-[#2D1B22] text-[#A6475B] dark:text-[#FB7185] font-bold text-xs flex items-center justify-center flex-shrink-0">
                {postAuthor.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#151515] dark:text-[#F5F5F5] leading-relaxed">
                  <strong className="font-semibold mr-1.5">{postAuthor}</strong>
                  <span>{postCaption}</span>
                </p>
                <div className="flex items-center space-x-3 mt-1.5 text-[11px] text-[#888888]">
                  <span>{formatRelativeTime(postTime)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Guest Comments */}
          {comments.map((comment) => {
            const likesCount = comment.likesCount ?? (comment.liked ? 1 : 0);

            return (
              <div key={comment.id} className="flex items-start justify-between space-x-3 py-0.5">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#F8F8F8] dark:bg-[#1C1C1E] border border-[#ECECEC] dark:border-[#2C2C2E] text-[#151515] dark:text-[#F5F5F5] font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {comment.avatarLetter}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#151515] dark:text-[#F5F5F5] leading-relaxed">
                      <strong className="font-semibold mr-1.5">{comment.authorNickname}</strong>
                      <span>{comment.text}</span>
                    </p>

                    {/* Attached GIF Reaction */}
                    {comment.gifUrl && (
                      <div className="mt-2 rounded-xl overflow-hidden max-w-[200px] border border-[#ECECEC] dark:border-[#2C2C2E] shadow-xs bg-stone-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={comment.gifUrl}
                          alt="GIF reaction"
                          className="w-full h-auto object-cover rounded-xl"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-3 mt-1.5 text-[11px] text-[#888888]">
                      <span>{formatRelativeTime(comment.createdAt)}</span>
                      {likesCount > 0 && (
                        <span className="font-semibold text-[#888888]">
                          {likesCount} {likesCount === 1 ? "like" : "likes"}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleReply(comment.authorNickname)}
                        className="font-semibold text-[#888888] hover:text-[#151515] dark:hover:text-white"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>

                {/* Instagram Heart Button for Comment */}
                <button
                  type="button"
                  onClick={() => onToggleLikeComment?.(comment.id)}
                  className="p-1 text-[#888888] hover:text-[#A6475B] active:scale-125 transition-transform flex-shrink-0"
                  aria-label="Like comment"
                >
                  {comment.liked ? (
                    <svg className="w-3.5 h-3.5 text-[#A6475B] dark:text-[#FB7185] fill-[#A6475B] dark:fill-[#FB7185]" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  )}
                </button>
              </div>
            );
          })}

          {comments.length === 0 && (
            <div className="py-14 text-center text-xs text-[#888888]">
              No comments yet. Be the first to congratulate the couple!
            </div>
          )}
        </div>

        {/* Instagram Inline GIF Picker Drawer */}
        {showGifPicker && (
          <div className="p-3 bg-[#F8F8F8] dark:bg-[#181818] border-t border-[#ECECEC] dark:border-[#262626] max-h-48 overflow-y-auto no-scrollbar animate-in slide-in-from-bottom duration-150">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#151515] dark:text-white uppercase tracking-wider">
                Wedding GIFs
              </span>
              <div className="flex items-center space-x-1">
                {["All", "Cheers", "Love", "Party"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setGifCategory(cat)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
                      gifCategory === cat
                        ? "bg-[#A6475B] text-white"
                        : "bg-white dark:bg-[#2C2C2E] text-[#666666] dark:text-[#A0A0A0]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 4-column GIF grid */}
            <div className="grid grid-cols-4 gap-1.5">
              {filteredGifs.map((gif) => (
                <button
                  key={gif.id}
                  type="button"
                  onClick={() => handleSelectGif(gif.url)}
                  className="relative aspect-square rounded-lg overflow-hidden border border-[#ECECEC] dark:border-[#2C2C2E] hover:opacity-85 active:scale-95 transition-transform bg-stone-900 group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={gif.url} alt={gif.title} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] truncate px-1 py-0.5 text-center">
                    {gif.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Instagram Floating Emoji Bar */}
        <div className="px-3 py-1.5 border-t border-[#ECECEC] dark:border-[#262626] flex items-center justify-between bg-white dark:bg-[#121212] text-lg">
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar flex-1 pr-2">
            {(showAllEmojis ? EXTENDED_EMOJIS : EXTENDED_EMOJIS.slice(0, 8)).map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  setCommentText((prev) => prev + emoji);
                  inputRef.current?.focus();
                }}
                className="hover:scale-125 active:scale-95 transition-transform p-0.5 flex-shrink-0"
                aria-label={`Add ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowAllEmojis(!showAllEmojis)}
            className="text-xs font-bold text-[#A6475B] dark:text-[#FB7185] px-1 hover:underline flex-shrink-0"
          >
            {showAllEmojis ? "Less" : "More"}
          </button>
        </div>

        {/* Instagram Bottom Input Bar with GIF & Post buttons */}
        <form
          onSubmit={handleSubmit}
          className="p-3 border-t border-[#ECECEC] dark:border-[#262626] bg-white dark:bg-[#121212] flex items-center space-x-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        >
          <div className="w-8 h-8 rounded-full bg-[#F9ECEF] dark:bg-[#2D1B22] text-[#A6475B] dark:text-[#FB7185] font-bold text-xs flex items-center justify-center flex-shrink-0">
            {currentUserNickname.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 flex items-center bg-[#F8F8F8] dark:bg-[#1C1C1E] border border-[#ECECEC] dark:border-[#2C2C2E] rounded-full px-3.5 py-1.5 focus-within:border-[#A6475B]/50 transition-colors">
            <input
              ref={inputRef}
              type="text"
              placeholder={`Add a comment for ${postAuthor}...`}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 text-xs bg-transparent border-none focus:outline-none text-[#151515] dark:text-[#F5F5F5] placeholder:text-[#999999]"
            />

            {/* Instagram GIF Button */}
            <button
              type="button"
              onClick={() => {
                setShowGifPicker(!showGifPicker);
                setShowAllEmojis(false);
              }}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider transition-colors ml-1 ${
                showGifPicker
                  ? "bg-[#A6475B] text-white"
                  : "border border-[#CCCCCC] dark:border-[#555555] text-[#151515] dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
              }`}
              aria-label="Add wedding GIF"
            >
              GIF
            </button>

            {commentText.trim() && (
              <button
                type="submit"
                className="text-xs font-bold text-[#A6475B] dark:text-[#FB7185] hover:opacity-80 active:scale-95 transition-all ml-2"
              >
                Post
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}