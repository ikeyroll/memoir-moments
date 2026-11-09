"use client";

import React, { useState, useRef, useEffect } from "react";
import { FeedPost } from "@/lib/types";
import { useMemoir } from "@/context/MemoirContext";
import { HeartIcon, CommentIcon, ShareIcon, BookmarkIcon, MusicNoteIcon } from "./RedesignIcons";
import { formatRelativeTime } from "@/lib/utils";
import { CommentsModal } from "./CommentsModal";
import { INITIAL_POST_COMMENTS, PostComment } from "@/lib/commentsData";
import { TouchSwipeCarousel } from "./TouchSwipeCarousel";

interface RedesignPostCardProps {
  post: FeedPost;
}

export function RedesignPostCard({ post }: RedesignPostCardProps) {
  const {
    session,
    weddingDetails,
    getMediaDataUrl,
    toggleLikePost,
    toggleSavePost,
    deletePost,
    playAudio,
    stopAudio,
    isMuted,
    currentAudioSource,
  } = useMemoir();
  const postRef = useRef<HTMLElement>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Local comments state
  const [comments, setComments] = useState<PostComment[]>(INITIAL_POST_COMMENTS[post.id] || []);

  const isLiked = session ? post.likedByNicknames.includes(session.nickname) : false;
  const isSaved = session ? session.savedPostIds.includes(post.id) : false;

  const isTrackPlaying = currentAudioSource?.trackId === post.attachedTrack?.trackId && currentAudioSource?.isPlaying;

  // Instagram-style AutoPlay on Scroll into View
  useEffect(() => {
    if (!post.attachedTrack) return;
    const element = postRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            playAudio(
              post.attachedTrack!.trackId,
              post.attachedTrack!.startSeconds,
              post.attachedTrack!.durationSeconds || 15
            );
          } else if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
            if (currentAudioSource?.trackId === post.attachedTrack?.trackId && currentAudioSource?.isPlaying) {
              stopAudio();
            }
          }
        });
      },
      { threshold: [0.2, 0.5, 0.8] }
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [post.attachedTrack, playAudio, stopAudio, currentAudioSource]);

  const handleToggleTrack = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!post.attachedTrack) return;
    if (isTrackPlaying && !isMuted) {
      stopAudio();
    } else {
      playAudio(
        post.attachedTrack.trackId,
        post.attachedTrack.startSeconds,
        post.attachedTrack.durationSeconds || 15,
        true
      );
    }
  };

  const handleShareClick = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleAddComment = (text: string, gifUrl?: string) => {
    const newComment: PostComment = {
      id: `c_${Date.now()}`,
      authorNickname: session?.nickname || "Guest",
      avatarLetter: (session?.nickname || "G").slice(0, 2).toUpperCase(),
      text: text || (gifUrl ? "Sent a GIF" : ""),
      gifUrl,
      createdAt: new Date().toISOString(),
      liked: false,
      likesCount: 0,
    };
    setComments((prev) => [...prev, newComment]);
  };

  const handleToggleLikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c;
        const newLiked = !c.liked;
        const currentCount = c.likesCount ?? (c.liked ? 1 : 0);
        return {
          ...c,
          liked: newLiked,
          likesCount: Math.max(0, currentCount + (newLiked ? 1 : -1)),
        };
      })
    );
  };

  // Safe mediaItems resolution (resolves IndexedDB URLs via getMediaDataUrl if needed)
  const mediaItems =
    post.mediaItems && post.mediaItems.length > 0
      ? post.mediaItems.map((item) => ({
          ...item,
          dataUrl: item.dataUrl || getMediaDataUrl(item.id) || "",
        }))
      : post.mediaIds.map((id) => ({
          id,
          dataUrl: getMediaDataUrl(id) || "",
          mimeType: "image/jpeg",
        }));

  const handleDownloadCurrentMedia = () => {
    const activeItem = mediaItems[currentSlideIndex] || mediaItems[0];
    if (!activeItem?.dataUrl) return;
    const link = document.createElement("a");
    link.href = activeItem.dataUrl;
    link.download = `memoir-${post.authorNickname.toLowerCase().replace(/\s+/g, "-")}-${currentSlideIndex + 1}.jpg`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Live filter adjustments
  const filterStyle = post.filterAdjustments
    ? {
        filter: `brightness(${100 + post.filterAdjustments.brightness}%) contrast(${100 + post.filterAdjustments.contrast}%) sepia(${Math.max(0, post.filterAdjustments.warmth)}%)`,
      }
    : undefined;

  return (
    <article ref={postRef} className="bg-white dark:bg-black border-b border-[#ECECEC] dark:border-[#262626] mb-3 transition-colors w-full">
      {copiedLink && (
        <div className="bg-[#151515] dark:bg-white text-white dark:text-[#151515] text-center py-1.5 text-xs font-medium">
          Link copied to clipboard
        </div>
      )}

      {/* 1. Post Header: Avatar, guest nickname, small timestamp and overflow menu */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-[#F8F8F8] dark:bg-[#1C1C1E] border border-[#ECECEC] dark:border-[#2C2C2E] flex items-center justify-center font-bold text-xs text-[#A6475B] dark:text-[#FB7185]">
            {post.authorNickname.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-sm text-[#151515] dark:text-white">{post.authorNickname}</span>
              {post.authorRole && (
                <span className="text-xs text-[#666666] dark:text-[#888888] font-normal">• {post.authorRole}</span>
              )}
            </div>
            {post.locationTag && (
              <p className="text-[11px] text-[#666666] dark:text-[#888888] line-clamp-1">{post.locationTag}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-[#666666] dark:text-[#888888] font-mono">{formatRelativeTime(post.createdAt)}</span>
          <button
            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
            className="p-1.5 text-[#666666] dark:text-[#888888] hover:text-[#151515] dark:hover:text-white"
            aria-label="Post options"
          >
            •••
          </button>
        </div>
      </div>

      {/* Options Dropdown Sheet */}
      {showOptionsMenu && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setShowOptionsMenu(false)} />
          <div className="fixed bottom-0 inset-x-0 z-50 max-w-[430px] mx-auto bg-white dark:bg-[#181818] rounded-t-2xl p-4 border-t border-[#ECECEC] dark:border-[#262626] text-center divide-y divide-[#ECECEC] dark:divide-[#262626] text-sm shadow-2xl">
            <button
              onClick={() => {
                toggleSavePost(post.id);
                setShowOptionsMenu(false);
              }}
              className="w-full py-3 text-[#151515] dark:text-white font-semibold"
            >
              {isSaved ? "Remove from Saved" : "Save memory"}
            </button>
            {weddingDetails.allowGuestDownloads && (
              <button
                onClick={() => {
                  handleDownloadCurrentMedia();
                  setShowOptionsMenu(false);
                }}
                className="w-full py-3 text-[#151515] dark:text-white font-medium"
              >
                Download photo
              </button>
            )}
            <button
              onClick={() => {
                handleShareClick();
                setShowOptionsMenu(false);
              }}
              className="w-full py-3 text-[#151515] dark:text-white"
            >
              Copy link
            </button>
            {(session?.role === "host" || session?.nickname === post.authorNickname) && (
              <button
                onClick={() => {
                  deletePost(post.id);
                  setShowOptionsMenu(false);
                }}
                className="w-full py-3 text-[#A6475B] dark:text-[#FB7185] font-semibold"
              >
                Delete memory
              </button>
            )}
            <button
              onClick={() => setShowOptionsMenu(false)}
              className="w-full py-3 text-[#666666] dark:text-[#A0A0A0]"
            >
              Cancel
            </button>
          </div>
        </>
      )}

      {/* 2. Butter-Smooth Native Scroll-Snap Touch Carousel with Instagram Sound Overlay */}
      <div className="relative w-full">
        <TouchSwipeCarousel
          mediaItems={mediaItems}
          aspectRatio={post.cropSettings?.aspectRatio === "square" ? "square" : "4:5"}
          filterStyle={filterStyle}
          textOverlay={post.textOverlay}
          onDoubleTap={() => {
            if (!isLiked) toggleLikePost(post.id);
          }}
          onSlideChange={(newIdx) => setCurrentSlideIndex(newIdx)}
        />

        {/* Instagram Floating Sound Button */}
        {post.attachedTrack && (
          <button
            type="button"
            onClick={handleToggleTrack}
            className="absolute bottom-3 right-3 z-10 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center text-xs backdrop-blur-sm active:scale-90 transition-transform shadow-md"
            aria-label={isTrackPlaying && !isMuted ? "Mute audio" : "Play audio"}
          >
            {isTrackPlaying && !isMuted ? (
              <span className="text-white text-[10px]">🔊</span>
            ) : (
              <span className="text-white text-[10px]">🔇</span>
            )}
          </button>
        )}
      </div>

      {/* 3. Action Row: Heart, Comment, Share, Bookmark */}
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => toggleLikePost(post.id)}
            className="p-1 -ml-1 text-[#151515] dark:text-white active:scale-125 transition-transform"
            aria-label={isLiked ? "Unlike memory" : "Like memory"}
          >
            <HeartIcon filled={isLiked} />
          </button>

          <button
            onClick={() => setIsCommentsOpen(true)}
            className="p-1 text-[#151515] dark:text-white hover:opacity-70 transition-opacity"
            aria-label="View and write comments"
          >
            <CommentIcon />
          </button>

          <button
            onClick={handleShareClick}
            className="p-1 text-[#151515] dark:text-white hover:opacity-70 transition-opacity"
            aria-label="Share link"
          >
            <ShareIcon />
          </button>
        </div>

        {/* Carousel Dots indicator */}
        {mediaItems.length > 1 && (
          <div className="flex items-center space-x-1">
            {mediaItems.map((_, idx) => (
              <span
                key={idx}
                className={`rounded-full transition-all ${
                  idx === currentSlideIndex
                    ? "w-1.5 h-1.5 bg-[#A6475B] dark:bg-[#FB7185]"
                    : "w-1 h-1 bg-[#ECECEC] dark:bg-[#333333]"
                }`}
              />
            ))}
          </div>
        )}

        <button
          onClick={() => toggleSavePost(post.id)}
          className="p-1 text-[#151515] dark:text-white active:scale-125 transition-transform"
          aria-label={isSaved ? "Remove from saved" : "Save to my memories"}
        >
          <BookmarkIcon filled={isSaved} />
        </button>
      </div>

      {/* 4. Like count and short caption with More/Less */}
      <div className="px-4 pb-1">
        <div className="text-sm font-semibold text-[#151515] dark:text-[#F5F5F5]">
          {post.likedByNicknames.length > 0 ? (
            <span>
              Liked by <strong>{post.likedByNicknames[0]}</strong>
              {post.likedByNicknames.length > 1 && (
                <> and {post.likedByNicknames.length - 1} others</>
              )}
            </span>
          ) : (
            <span className="font-normal text-[#666666] dark:text-[#888888]">Be the first to like this memory</span>
          )}
        </div>

        {post.caption && (
          <div className="text-sm text-[#151515] dark:text-[#F5F5F5] leading-relaxed mt-1">
            <span className="font-semibold mr-1.5">{post.authorNickname}</span>
            <span className={isCaptionExpanded ? "" : "line-clamp-2"}>{post.caption}</span>
            {post.caption.length > 90 && (
              <button
                onClick={() => setIsCaptionExpanded(!isCaptionExpanded)}
                className="text-[#666666] dark:text-[#888888] text-xs font-medium ml-1 hover:underline"
              >
                {isCaptionExpanded ? "Less" : "More"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* 5. View comments link and small music credit where a track is attached */}
      <div className="px-4 pb-3 flex items-center justify-between text-xs">
        <button
          onClick={() => setIsCommentsOpen(true)}
          className="text-[#666666] dark:text-[#888888] hover:underline"
        >
          {comments.length > 0
            ? `View all ${comments.length} comments`
            : "Add a comment..."}
        </button>

        {post.attachedTrack && (
          <button
            type="button"
            onClick={handleToggleTrack}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border text-[11px] transition-all ${
              isTrackPlaying && !isMuted
                ? "bg-[#F9ECEF] dark:bg-[#2D1B22] border-[#A6475B]/30 dark:border-[#FB7185]/30 text-[#A6475B] dark:text-[#FB7185] font-semibold"
                : "bg-[#F8F8F8] dark:bg-[#1C1C1E] border-[#ECECEC] dark:border-[#2C2C2E] text-[#151515] dark:text-white hover:border-[#A6475B]"
            }`}
            aria-label={isTrackPlaying && !isMuted ? "Pause song" : "Play attached song"}
          >
            <MusicNoteIcon className={`w-3.5 h-3.5 ${isTrackPlaying && !isMuted ? "text-[#A6475B] dark:text-[#FB7185] animate-pulse" : "text-[#666666] dark:text-[#888888]"}`} />
            <span className="font-medium truncate max-w-[140px]">{post.attachedTrack.title}</span>
            <span className="text-[#A6475B] dark:text-[#FB7185] font-bold ml-0.5">{isTrackPlaying && !isMuted ? "❚❚" : "▶"}</span>
          </button>
        )}
      </div>

      {/* Post Comments Sheet */}
      <CommentsModal
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        postAuthor={post.authorNickname}
        postCaption={post.caption}
        postTime={post.createdAt}
        comments={comments}
        onAddComment={handleAddComment}
        onToggleLikeComment={handleToggleLikeComment}
        currentUserNickname={session?.nickname || "Guest"}
      />
    </article>
  );
}
