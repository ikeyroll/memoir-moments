"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useMemoir } from "@/context/MemoirContext";
import { formatRelativeTime } from "@/lib/utils";
import { MusicNoteIcon, HeartIcon } from "./RedesignIcons";

export function RedesignStoryViewer() {
  const {
    activeStoryId,
    setActiveStoryId,
    stories,
    getMediaDataUrl,
    markStorySeen,
    playAudio,
    pauseAudio,
    resumeAudio,
    stopAudio,
    isMuted,
    toggleAudioMute,
    createWish,
  } = useMemoir();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [wishInput, setWishInput] = useState("");
  const [heartAnim, setHeartAnim] = useState(false);
  const [wishSentToast, setWishSentToast] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number; time: number; active: boolean }>({
    x: 0,
    y: 0,
    time: 0,
    active: false,
  });
  const isHoldingRef = useRef(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncedStoryIdRef = useRef<string | null>(null);

  // Sync index ONLY when activeStoryId itself changes
  useEffect(() => {
    if (!activeStoryId) {
      lastSyncedStoryIdRef.current = null;
      return;
    }
    if (lastSyncedStoryIdRef.current !== activeStoryId) {
      const idx = stories.findIndex((s) => s.id === activeStoryId);
      if (idx >= 0) {
        lastSyncedStoryIdRef.current = activeStoryId;
        setCurrentIndex(idx);
        setProgress(0);
        setIsPaused(false);
      }
    }
  }, [activeStoryId, stories]);

  const currentStory = stories[currentIndex];

  // Mark current story as seen without causing index reset
  useEffect(() => {
    if (activeStoryId && currentStory) {
      markStorySeen(currentStory.id);
    }
  }, [activeStoryId, currentStory?.id, markStorySeen, currentStory]);

  // Handle Play/Stop music when story changes
  useEffect(() => {
    if (!activeStoryId || !currentStory) {
      stopAudio();
      return;
    }

    if (currentStory.attachedTrack) {
      playAudio(
        currentStory.attachedTrack.trackId,
        currentStory.attachedTrack.startSeconds,
        currentStory.attachedTrack.durationSeconds || 15
      );
    } else {
      stopAudio();
    }

    return () => {
      stopAudio();
    };
  }, [activeStoryId, currentStory?.id, currentStory, playAudio, stopAudio]);

  // Pause / resume audio in sync with story pause
  useEffect(() => {
    if (!currentStory?.attachedTrack) return;
    if (isPaused) {
      pauseAudio();
    } else {
      resumeAudio();
    }
  }, [isPaused, currentStory, pauseAudio, resumeAudio]);

  const handleClose = useCallback(() => {
    stopAudio();
    lastSyncedStoryIdRef.current = null;
    setActiveStoryId(null);
    setProgress(0);
    setIsPaused(false);
  }, [stopAudio, setActiveStoryId]);

  const goToStoryIndex = useCallback(
    (nextIdx: number) => {
      if (nextIdx >= 0 && nextIdx < stories.length) {
        const nextStory = stories[nextIdx];
        lastSyncedStoryIdRef.current = nextStory.id;
        setCurrentIndex(nextIdx);
        setActiveStoryId(nextStory.id);
        setProgress(0);
        setIsPaused(false);
      }
    },
    [stories, setActiveStoryId]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      goToStoryIndex(currentIndex + 1);
    } else {
      handleClose();
    }
  }, [currentIndex, stories.length, goToStoryIndex, handleClose]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      goToStoryIndex(currentIndex - 1);
    } else {
      // On first story, restart progress from 0 like Instagram
      setProgress(0);
    }
  }, [currentIndex, goToStoryIndex]);

  // Advance when progress reaches 100 (outside of state updater to prevent double-skips)
  useEffect(() => {
    if (progress >= 100 && activeStoryId) {
      handleNext();
    }
  }, [progress, activeStoryId, handleNext]);

  // Timer loop for story duration
  useEffect(() => {
    if (!activeStoryId || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const durationSeconds = currentStory?.attachedTrack?.durationSeconds || 6;
    const intervalStepMs = 50;
    const increment = (intervalStepMs / (durationSeconds * 1000)) * 100;

    timerRef.current = setInterval(() => {
      setProgress((prev) => Math.min(100, prev + increment));
    }, intervalStepMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeStoryId, currentStory?.id, currentStory?.attachedTrack?.durationSeconds, isPaused]);

  // Keyboard navigation (ArrowLeft, ArrowRight, Space, Escape)
  useEffect(() => {
    if (!activeStoryId) return;

    const handleKey = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT") return;
      if (e.key === "Escape") handleClose();
      else if (e.key === "ArrowRight") handleNext();
      else if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === " ") {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeStoryId, handleClose, handleNext, handlePrev]);

  // Unified Pointer Gesture Handling (prevents duplicate touch + mouse events)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Ignore clicks on buttons
    if ((e.target as HTMLElement).closest("button")) return;

    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
      active: true,
    };
    isHoldingRef.current = false;

    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);

    // Hold > 320ms pauses story
    holdTimerRef.current = setTimeout(() => {
      if (pointerStartRef.current.active) {
        isHoldingRef.current = true;
        setIsPaused(true);
      }
    }, 320);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerStartRef.current.active) return;
    pointerStartRef.current.active = false;

    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;
    const duration = Date.now() - pointerStartRef.current.time;

    if (isHoldingRef.current) {
      setIsPaused(false);
      isHoldingRef.current = false;
      // Still allow horizontal swipe even if user dragged slowly
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) handleNext();
        else handlePrev();
      }
      return;
    }

    // 1. Swipe down -> dismiss story viewer
    if (dy > 65 && Math.abs(dy) > Math.abs(dx)) {
      handleClose();
      return;
    }

    // 2. Swipe left -> next story
    if (dx < -35 && Math.abs(dx) > Math.abs(dy)) {
      handleNext();
      return;
    }

    // 3. Swipe right -> previous story
    if (dx > 35 && Math.abs(dx) > Math.abs(dy)) {
      handlePrev();
      return;
    }

    // 4. Tap left 35% vs right 65% relative to the story container (works on both phone and desktop!)
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20 && duration < 350) {
      const rect = canvasRef.current?.getBoundingClientRect();
      const width = rect ? rect.width : 390;
      const relativeX = rect ? e.clientX - rect.left : e.clientX;

      if (relativeX < width * 0.35) {
        handlePrev();
      } else {
        handleNext();
      }
    }
  };

  const handlePointerCancel = () => {
    pointerStartRef.current.active = false;
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (isHoldingRef.current) {
      setIsPaused(false);
      isHoldingRef.current = false;
    }
  };

  const handleToggleStorySound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentStory?.attachedTrack) return;
    if (isMuted) {
      playAudio(
        currentStory.attachedTrack.trackId,
        currentStory.attachedTrack.startSeconds,
        currentStory.attachedTrack.durationSeconds || 15,
        true
      );
    } else {
      toggleAudioMute();
    }
  };

  if (!activeStoryId || !currentStory) return null;

  const currentMediaUrl = currentStory.mediaItem?.dataUrl || getMediaDataUrl(currentStory.mediaId) || "";
  const isVideoStory =
    currentStory.mediaItem?.isVideo ||
    currentStory.mediaItem?.mimeType?.startsWith("video/") ||
    currentMediaUrl.startsWith("data:video/");

  const handleSendWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishInput.trim()) return;
    createWish(wishInput.trim(), `Story Reply to ${currentStory.authorNickname}`, "Story");
    setWishInput("");
    setHeartAnim(true);
    setWishSentToast(true);
    setTimeout(() => setHeartAnim(false), 1200);
    setTimeout(() => setWishSentToast(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overscroll-none"
      role="dialog"
      aria-modal="true"
      aria-label="Story viewer"
    >
      <div className="relative w-full h-full max-w-[430px] max-h-[100dvh] flex flex-col bg-stone-950 overflow-hidden shadow-2xl">
        {/* Screen 08 Top: Instagram Thin progress segments */}
        <div className="absolute top-0 inset-x-0 z-30 p-3 pt-3 bg-gradient-to-b from-black/85 via-black/45 to-transparent pointer-events-none">
          <div className="flex items-center space-x-1 w-full">
            {stories.map((st, idx) => (
              <button
                key={st.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToStoryIndex(idx);
                }}
                className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden pointer-events-auto cursor-pointer focus:outline-none"
                aria-label={`Jump to story ${idx + 1}`}
              >
                <div
                  className="h-full bg-white transition-all duration-75 ease-linear rounded-full"
                  style={{
                    width:
                      idx < currentIndex
                        ? "100%"
                        : idx === currentIndex
                        ? `${progress}%`
                        : "0%",
                  }}
                />
              </button>
            ))}
          </div>

          {/* Avatar, nickname, relative time, song credit, pause/sound/close controls */}
          <div className="flex items-center justify-between mt-2.5 text-white pointer-events-auto">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full border border-white/60 bg-stone-800 flex items-center justify-center font-bold text-xs text-white">
                {currentStory.authorNickname.slice(0, 2).toUpperCase()}
              </div>
              <div className="leading-tight">
                <div className="flex items-center space-x-1.5">
                  <span className="font-semibold text-xs tracking-wide">
                    {currentStory.authorNickname}
                  </span>
                  <span className="text-[10px] text-white/70 font-mono">
                    {formatRelativeTime(currentStory.createdAt)}
                  </span>
                  <span className="text-[10px] text-white/50 font-mono">
                    ({currentIndex + 1}/{stories.length})
                  </span>
                </div>
                {currentStory.attachedTrack && (
                  <button
                    type="button"
                    onClick={handleToggleStorySound}
                    className="flex items-center space-x-1 text-[10px] text-white/90 mt-0.5 hover:underline"
                  >
                    <MusicNoteIcon className="w-3 h-3 text-[#FB7185]" />
                    <span className="truncate max-w-[150px] font-medium">{currentStory.attachedTrack.title}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Instagram Story Controls: Pause/Play, Mute/Unmute, Close */}
            <div className="flex items-center space-x-2 text-white">
              {/* Pause / Resume Toggle */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPaused((p) => !p);
                }}
                className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white text-xs transition-colors"
                aria-label={isPaused ? "Resume story" : "Pause story"}
                title={isPaused ? "Resume" : "Pause"}
              >
                {isPaused ? "▶" : "❚❚"}
              </button>

              {/* Mute / Unmute Sound Toggle */}
              {currentStory.attachedTrack && (
                <button
                  type="button"
                  onClick={handleToggleStorySound}
                  className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors"
                  aria-label={isMuted ? "Unmute sound" : "Mute sound"}
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L21.75 14.25m0-4.5l-4.5 4.5M15.536 8.464a5 5 0 010 7.072M9.75 4.5L5.25 9H1.5v6h3.75l4.5 4.5V4.5z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-white animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M9.75 4.5L5.25 9H1.5v6h3.75l4.5 4.5V4.5z" />
                    </svg>
                  )}
                </button>
              )}

              {/* Close Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
                className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white text-base font-bold transition-colors"
                aria-label="Close story"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Story Photo/Video Canvas with Unified Pointer Gestures */}
        <div
          ref={canvasRef}
          className="relative flex-1 w-full bg-stone-950 flex items-center justify-center cursor-pointer touch-none"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          {currentMediaUrl ? (
            isVideoStory ? (
              <video
                key={currentStory.id}
                src={currentMediaUrl}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover pointer-events-none"
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={currentStory.id}
                src={currentMediaUrl}
                alt={currentStory.caption || "Story"}
                className="w-full h-full object-cover pointer-events-none"
              />
            )
          ) : (
            <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          )}

          {/* Subtle Left / Right Navigation Chevrons for 1-Tap Clarity */}
          {currentIndex > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/35 hover:bg-black/65 text-white flex items-center justify-center text-lg font-bold backdrop-blur-2xs active:scale-90 transition-all"
              aria-label="Previous story"
            >
              ‹
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/35 hover:bg-black/65 text-white flex items-center justify-center text-lg font-bold backdrop-blur-2xs active:scale-90 transition-all"
            aria-label="Next story"
          >
            ›
          </button>

          {/* Floating animated heart burst */}
          {heartAnim && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 animate-in zoom-in-50 fade-in-0 duration-200">
              <svg className="w-28 h-28 text-[#A6475B] fill-current drop-shadow-2xl animate-pulse" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          )}

          {wishSentToast && (
            <div className="absolute top-20 inset-x-0 flex justify-center pointer-events-none z-40">
              <span className="px-4 py-1.5 rounded-full bg-black/75 text-white text-xs font-semibold backdrop-blur-xs shadow-lg">
                Sent to wedding wishes ✨
              </span>
            </div>
          )}
        </div>

        {/* Screen 08 Bottom: Caption, Leave a wish, and Heart */}
        <div className="relative z-30 p-3 pt-2 bg-gradient-to-t from-black via-black/80 to-transparent text-white space-y-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {currentStory.caption && (
            <p className="text-sm text-white/95 px-1 font-serif italic drop-shadow">
              {currentStory.caption}
            </p>
          )}

          <div className="flex items-center space-x-2 pt-1">
            <form onSubmit={handleSendWish} className="flex-1 flex items-center bg-white/20 border border-white/30 rounded-full px-3.5 py-2 backdrop-blur-xs">
              <input
                type="text"
                placeholder={`Reply to ${currentStory.authorNickname}...`}
                value={wishInput}
                onChange={(e) => setWishInput(e.target.value)}
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
                className="w-full bg-transparent text-xs text-white placeholder:text-white/70 focus:outline-none"
              />
              {wishInput && (
                <button type="submit" className="text-xs font-bold text-white hover:text-rose-200 ml-1.5 active:scale-95">
                  Send
                </button>
              )}
            </form>

            <button
              type="button"
              onClick={() => {
                createWish(`❤️ Sent love to ${currentStory.authorNickname}'s story!`, "Story Reaction", "Story");
                setHeartAnim(true);
                setTimeout(() => setHeartAnim(false), 1200);
              }}
              className="p-2 text-white hover:text-[#A6475B] active:scale-125 transition-transform"
              aria-label="Send love reaction"
            >
              <HeartIcon filled className="w-6 h-6 text-white active:text-[#A6475B]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
