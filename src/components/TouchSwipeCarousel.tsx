"use client";

import React, { useRef, useState } from "react";
import { MediaItem } from "@/lib/types";

interface TouchSwipeCarouselProps {
  mediaItems: MediaItem[];
  aspectRatio?: "4:5" | "square" | "original";
  onDoubleTap?: () => void;
  filterStyle?: React.CSSProperties;
  textOverlay?: string;
  onSlideChange?: (index: number) => void;
}

export function TouchSwipeCarousel({
  mediaItems,
  aspectRatio = "4:5",
  onDoubleTap,
  filterStyle,
  textOverlay,
  onSlideChange,
}: TouchSwipeCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHeartPop, setShowHeartPop] = useState(false);
  const lastTapRef = useRef<number>(0);
  const pointerStartRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  // Native scroll snap observer to detect active slide smoothly
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, clientWidth } = containerRef.current;
    if (clientWidth === 0) return;
    const newIndex = Math.round(scrollLeft / clientWidth);
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < mediaItems.length) {
      setCurrentIndex(newIndex);
      onSlideChange?.(newIndex);
    }
  };

  // Programmatic slide transition
  const scrollToSlide = (idx: number) => {
    const clamped = Math.max(0, Math.min(mediaItems.length - 1, idx));
    if (containerRef.current) {
      const width = containerRef.current.clientWidth;
      containerRef.current.scrollTo({
        left: clamped * width,
        behavior: "smooth",
      });
    }
    setCurrentIndex(clamped);
    onSlideChange?.(clamped);
  };

  // Pointer drag support for both mouse drag and touch swipe
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    pointerStartRef.current = { x: e.clientX, y: e.clientY, active: true };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerStartRef.current.active) return;
    pointerStartRef.current.active = false;

    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;

    // Horizontal swipe/drag (> 40px)
    if (mediaItems.length > 1 && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0 && currentIndex < mediaItems.length - 1) {
        scrollToSlide(currentIndex + 1);
        return;
      } else if (dx > 0 && currentIndex > 0) {
        scrollToSlide(currentIndex - 1);
        return;
      }
    }

    // Double-tap detection on quick tap without drag
    if (Math.abs(dx) < 15 && Math.abs(dy) < 15) {
      const now = Date.now();
      const timeDiff = now - lastTapRef.current;
      if (timeDiff < 320 && timeDiff > 0) {
        setShowHeartPop(true);
        setTimeout(() => setShowHeartPop(false), 850);
        onDoubleTap?.();
        lastTapRef.current = 0;
      } else {
        lastTapRef.current = now;
      }
    }
  };

  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "original"
      ? "aspect-auto max-h-[80dvh]"
      : "aspect-[4/5]";

  return (
    <div
      className={`relative w-full ${aspectClass} bg-stone-950 overflow-hidden select-none`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* Scroll-Snap Touch Container (Edge-to-edge, butter smooth 60fps momentum swipe) */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex w-full h-full overflow-x-auto no-scrollbar scroll-smooth"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorX: "contain",
          touchAction: "pan-x pan-y pinch-zoom",
        }}
      >
        {mediaItems.map((item, idx) => (
          <div
            key={item.id || idx}
            className="w-full h-full flex-shrink-0 flex items-center justify-center relative bg-stone-950"
            style={{ scrollSnapAlign: "center", scrollSnapStop: "always" }}
          >
            {item.isVideo || item.mimeType?.startsWith("video/") || item.dataUrl?.startsWith("data:video/") ? (
              <video
                src={item.dataUrl}
                autoPlay
                loop
                muted
                playsInline
                style={filterStyle}
                className="w-full h-full object-cover"
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={item.dataUrl}
                alt="Wedding moment"
                style={filterStyle}
                className="w-full h-full object-cover pointer-events-none"
                loading={idx === 0 ? "eager" : "lazy"}
              />
            )}
          </div>
        ))}
      </div>

      {/* Text Overlay if added */}
      {textOverlay && (
        <div className="absolute bottom-6 inset-x-4 text-center pointer-events-none z-10">
          <span className="inline-block px-4 py-1.5 rounded-xl bg-black/60 text-white font-serif italic text-base drop-shadow">
            {textOverlay}
          </span>
        </div>
      )}

      {/* Double-tap animated heart pop */}
      {showHeartPop && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 animate-in zoom-in-50 fade-in-0 duration-150">
          <svg className="w-24 h-24 text-white fill-current drop-shadow-2xl animate-pulse" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      )}

      {/* Carousel Dots & Number Pill */}
      {mediaItems.length > 1 && (
        <>
          {/* 1/3 overlay badge on top right */}
          <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-black/65 text-white text-[11px] font-mono tracking-wider backdrop-blur-sm z-10">
            {currentIndex + 1}/{mediaItems.length}
          </div>

          {/* Left/Right Navigation Arrows */}
          {currentIndex > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                scrollToSlide(currentIndex - 1);
              }}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/55 hover:bg-black/80 text-white text-base font-bold flex items-center justify-center z-10 shadow active:scale-90 transition-all"
              aria-label="Previous slide"
            >
              ‹
            </button>
          )}

          {currentIndex < mediaItems.length - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                scrollToSlide(currentIndex + 1);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/55 hover:bg-black/80 text-white text-base font-bold flex items-center justify-center z-10 shadow active:scale-90 transition-all"
              aria-label="Next slide"
            >
              ›
            </button>
          )}
        </>
      )}
    </div>
  );
}
