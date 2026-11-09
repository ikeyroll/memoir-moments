"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useMemoir } from "@/context/MemoirContext";

type SplashStage = "sealed" | "opening" | "card-open" | "fading-out";

// Decorative floating petals & gold dust particles
const FLOATING_PETALS = [
  { id: 1, left: "12%", delay: "0.9s", duration: "3.6s", size: 12, type: "petal" },
  { id: 2, left: "26%", delay: "1.2s", duration: "4.1s", size: 9, type: "sparkle" },
  { id: 3, left: "44%", delay: "0.8s", duration: "3.8s", size: 14, type: "petal" },
  { id: 4, left: "62%", delay: "1.4s", duration: "3.9s", size: 11, type: "petal" },
  { id: 5, left: "78%", delay: "1.0s", duration: "3.5s", size: 10, type: "sparkle" },
  { id: 6, left: "88%", delay: "1.5s", duration: "4.2s", size: 13, type: "petal" },
  { id: 7, left: "34%", delay: "1.8s", duration: "3.7s", size: 11, type: "petal" },
  { id: 8, left: "68%", delay: "1.7s", duration: "4.0s", size: 9, type: "sparkle" },
];

function SoaringDoveSVG({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Soft Golden Aura Behind Dove */}
      <circle cx="62" cy="52" r="28" fill="url(#doveGlow)" opacity="0.45" />

      {/* Back Wing (Animated Wing Beat) */}
      <g className="animate-wing-beat" style={{ animationDelay: "0.06s" }}>
        <path
          d="M 55 48 C 42 20, 18 10, 8 18 C 18 32, 32 44, 48 52 Z"
          fill="#F4EFEA"
          stroke="#D4AF37"
          strokeWidth="0.9"
        />
      </g>

      {/* Graceful Dove Body & Fanned Tail */}
      <path
        d="M 22 66 C 34 62, 44 56, 56 50 C 68 44, 78 40, 88 43 C 93 45, 96 48, 98 46 C 95 52, 88 57, 76 60 C 62 64, 46 69, 28 76 C 20 74, 16 70, 22 66 Z"
        fill="#FFFFFF"
        stroke="#C59B58"
        strokeWidth="1.1"
      />

      {/* Tail Feather Lines */}
      <path d="M 22 68 L 36 63 M 25 72 L 38 66" stroke="#D4AF37" strokeWidth="0.8" strokeLinecap="round" />

      {/* Front Wing (Animated Wing Beat) */}
      <g className="animate-wing-beat">
        <path
          d="M 58 52 C 52 22, 32 6, 16 12 C 24 28, 38 44, 54 55 Z"
          fill="#FFFFFF"
          stroke="#C59B58"
          strokeWidth="1.1"
        />
        <path
          d="M 24 18 C 34 28, 44 38, 52 48 M 32 15 C 40 26, 48 36, 54 46"
          stroke="#E5C282"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
      </g>

      {/* Dove Eye & Golden Beak */}
      <circle cx="90" cy="45" r="1.4" fill="#2C2218" />
      <path d="M 97 45 L 104 44 L 98 48 Z" fill="#D4AF37" />

      {/* Golden Olive / Rose Twig in Beak */}
      <path
        d="M 99 46 C 106 49, 112 47, 117 42"
        stroke="#B88746"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <ellipse cx="108" cy="45" rx="3" ry="1.5" transform="rotate(-20 108 45)" fill="#9FB098" />
      <ellipse cx="113" cy="47" rx="3" ry="1.5" transform="rotate(15 113 47)" fill="#84987E" />
      <circle cx="117" cy="42" r="2.2" fill="#ECA1AC" />

      <defs>
        <radialGradient id="doveGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(62 52) scale(28)">
          <stop stopColor="#FFE5A3" />
          <stop offset="1" stopColor="#FFE5A3" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function WelcomeInvitationSplash() {
  const {
    weddingDetails,
    isWelcomeSplashOpen,
    setIsWelcomeSplashOpen,
    setCurrentNavTab,
    theme,
  } = useMemoir();

  const [stage, setStage] = useState<SplashStage>("sealed");
  const [animKey, setAnimKey] = useState(0);
  const [autoClosePaused, setAutoClosePaused] = useState(false);

  const brideName = weddingDetails.brideName || weddingDetails.partnerOne || "Farah Al-Zahra";
  const groomName = weddingDetails.groomName || weddingDetails.partnerTwo || "Daniyal Haris";
  const brideFirst = brideName.split(" ")[0];
  const groomFirst = groomName.split(" ")[0];
  const monogram = `${brideFirst.slice(0, 1).toUpperCase()} & ${groomFirst.slice(0, 1).toUpperCase()}`;
  const welcomeText =
    weddingDetails.invitationWelcomeNote ||
    weddingDetails.welcomeNote ||
    "With joyful hearts, we warmly invite you to share our special day and capture every cherished moment.";

  // Trigger smooth fade out and close
  const handleSmoothDismiss = useCallback((navigateToWishes = false) => {
    setStage("fading-out");
    setTimeout(() => {
      setIsWelcomeSplashOpen(false);
      if (navigateToWishes) {
        setCurrentNavTab("wishes");
      }
    }, 650);
  }, [setIsWelcomeSplashOpen, setCurrentNavTab]);

  // Orchestrate multi-stage envelope -> flying doves -> rising card -> fade out sequence
  useEffect(() => {
    if (!isWelcomeSplashOpen) return;

    setStage("sealed");

    // 1. Open Wax Seal & Envelope Flap + Release Flying Doves
    const t1 = setTimeout(() => {
      setStage("opening");
    }, 550);

    // 2. Slide Invitation Card Up Out of Envelope & Animate Calligraphy Fonts
    const t2 = setTimeout(() => {
      setStage("card-open");
    }, 1250);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isWelcomeSplashOpen, animKey]);

  // Auto-fade out after guest has admired the opened invitation (unless paused)
  useEffect(() => {
    if (!isWelcomeSplashOpen || stage !== "card-open" || autoClosePaused) return;

    const fadeTimer = setTimeout(() => {
      handleSmoothDismiss(false);
    }, 5200);

    return () => clearTimeout(fadeTimer);
  }, [isWelcomeSplashOpen, stage, autoClosePaused, handleSmoothDismiss]);

  if (!isWelcomeSplashOpen) return null;

  const isEnvelopeOpened = stage === "opening" || stage === "card-open" || stage === "fading-out";
  const isCardElevated = stage === "card-open" || stage === "fading-out";

  return (
    <div
      className={`fixed inset-0 z-50 w-full max-w-[430px] mx-auto flex flex-col items-center justify-between overflow-hidden select-none transition-all duration-700 ${
        stage === "fading-out"
          ? "opacity-0 scale-105 pointer-events-none"
          : "opacity-100 scale-100"
      } bg-gradient-to-b from-[#FAF5EE] via-[#FFFDF9] to-[#F3EAE0] dark:from-[#090807] dark:via-[#120F0C] dark:to-[#080706] text-[#221C16] dark:text-[#F7EFE6] shadow-2xl`}
      role="dialog"
      aria-modal="true"
      aria-label="Wedding Welcome Invitation Splash"
    >
      {/* =====================================================================
          1. TOP FLORAL ARCH & AMBIENT CONTROLS
         ===================================================================== */}
      <div className="relative w-full pt-3 px-4 flex items-center justify-between z-30">
        {/* Replay / Pause Auto-Fade Pill */}
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => {
              setAutoClosePaused(true);
              setAnimKey((k) => k + 1);
            }}
            className="px-2.5 py-1 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-xs border border-[#E2D3BE] dark:border-[#3A2E21] text-[10px] font-semibold text-[#7A5B2B] dark:text-[#E5C282] hover:opacity-90 active:scale-95 transition-all flex items-center space-x-1 shadow-2xs"
            title="Replay envelope and flying birds animation"
          >
            <span>🕊️</span>
            <span>Replay</span>
          </button>

          {!autoClosePaused && stage === "card-open" && (
            <button
              type="button"
              onClick={() => setAutoClosePaused(true)}
              className="px-2 py-1 rounded-full bg-black/5 dark:bg-white/5 text-[10px] text-[#888888] dark:text-[#A0A0A0] hover:text-[#151515] dark:hover:text-white transition-colors"
            >
              Hold open
            </button>
          )}
        </div>

        {/* Skip / Close Button */}
        <button
          type="button"
          onClick={() => handleSmoothDismiss(false)}
          className="px-3 py-1 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-xs border border-[#E2D3BE] dark:border-[#3A2E21] text-[10px] font-semibold text-[#666666] dark:text-[#C5B49E] hover:text-[#151515] dark:hover:text-white active:scale-95 transition-all shadow-2xs"
          aria-label="Skip welcome animation"
        >
          Skip ›
        </button>
      </div>

      {/* Top Botanical Floral Wreath SVG */}
      <div className="w-full flex justify-center -mt-1 pointer-events-none z-10">
        <svg className="w-64 h-14 overflow-visible" viewBox="0 0 260 60" fill="none">
          <path
            d="M 15 42 C 55 12, 95 36, 130 26 C 165 36, 205 12, 245 42"
            stroke={theme === "dark" ? "#E5C282" : "#B88746"}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path d="M 55 24 C 62 17, 72 20, 68 28 C 62 28, 58 26, 55 24 Z" fill="#9FB098" opacity="0.85" />
          <path d="M 205 24 C 198 17, 188 20, 192 28 C 198 28, 202 26, 205 24 Z" fill="#9FB098" opacity="0.85" />
          <path d="M 88 31 C 94 37, 104 34, 100 27 C 94 27, 91 29, 88 31 Z" fill="#84987E" opacity="0.8" />
          <path d="M 172 31 C 166 37, 156 34, 160 27 C 166 27, 169 29, 172 31 Z" fill="#84987E" opacity="0.8" />
          {/* Center Blush Rose */}
          <circle cx="130" cy="26" r="13" fill="#F4BAC3" opacity="0.9" />
          <circle cx="128" cy="24" r="9.5" fill="#ECA1AC" opacity="0.9" />
          <circle cx="132" cy="27" r="6.5" fill="#D46A7E" opacity="0.85" />
          <circle cx="130" cy="26" r="3.5" fill="#A6475B" />
          {/* Side Buds */}
          <circle cx="108" cy="22" r="6" fill="#F8C9D1" opacity="0.85" />
          <circle cx="152" cy="22" r="6" fill="#F8C9D1" opacity="0.85" />
          {/* Baby's Breath */}
          <circle cx="76" cy="16" r="2.2" fill="#FFFFFF" stroke="#D4AF37" strokeWidth="0.6" />
          <circle cx="184" cy="16" r="2.2" fill="#FFFFFF" stroke="#D4AF37" strokeWidth="0.6" />
        </svg>
      </div>

      {/* =====================================================================
          2. SOARING WHITE DOVES (BIRDS FLYING) & FLOATING ROSE PETALS
         ===================================================================== */}
      {isEnvelopeOpened && (
        <div key={`birds-${animKey}`} className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
          {/* Left Soaring White Dove */}
          <div className="absolute left-1/2 top-[56%] -ml-14 animate-dove-left">
            <SoaringDoveSVG className="w-24 h-20 drop-shadow-[0_8px_16px_rgba(184,135,70,0.28)]" />
          </div>

          {/* Right Soaring White Dove */}
          <div className="absolute left-1/2 top-[58%] -ml-10 animate-dove-right">
            <SoaringDoveSVG className="w-22 h-18 drop-shadow-[0_8px_16px_rgba(184,135,70,0.28)]" />
          </div>

          {/* Floating Rose Petals & Gold Sparkles */}
          {FLOATING_PETALS.map((p) => (
            <div
              key={p.id}
              className="absolute bottom-24 opacity-0"
              style={{
                left: p.left,
                animation: `petalDrift ${p.duration} ease-out ${p.delay} forwards`,
              }}
            >
              {p.type === "petal" ? (
                <svg width={p.size} height={p.size} viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 2 C15 2, 18 7, 15 14 C12 19, 8 19, 5 14 C2 7, 5 2, 10 2 Z"
                    fill="#ECA1AC"
                    opacity="0.75"
                  />
                </svg>
              ) : (
                <span className="text-xs text-[#D4AF37] dark:text-[#FFE4A3] drop-shadow-xs">✦</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* =====================================================================
          3. CENTER STAGE: ENVELOPE + RISING INVITATION CARD
         ===================================================================== */}
      <div className="relative flex-1 w-full px-4 flex flex-col items-center justify-center z-20">
        
        {/* THE RISING WEDDING INVITATION CARD */}
        <div
          key={`card-${animKey}`}
          className={`relative w-full max-w-[356px] rounded-[26px] bg-[#FFFDF9] dark:bg-[#15120F] border-2 border-[#E5D3B3] dark:border-[#3D3122] shadow-[0_20px_50px_rgba(140,100,40,0.22)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.85)] px-5 py-5 text-center transition-all duration-1000 ease-out z-20 ${
            isCardElevated
              ? "translate-y-0 scale-100 opacity-100"
              : isEnvelopeOpened
              ? "translate-y-12 scale-90 opacity-90"
              : "translate-y-28 scale-75 opacity-0 pointer-events-none"
          }`}
        >
          {/* Inner Gold Foil Frame Border */}
          <div className="absolute inset-2 rounded-[20px] border border-[#D4AF37]/40 dark:border-[#E5C282]/25 pointer-events-none" />

          {/* Corner Gold Filigree Stars */}
          <span className="absolute top-3 left-3.5 text-[10px] text-[#C59B58] dark:text-[#E5C282] opacity-70">✦</span>
          <span className="absolute top-3 right-3.5 text-[10px] text-[#C59B58] dark:text-[#E5C282] opacity-70">✦</span>
          <span className="absolute bottom-3 left-3.5 text-[10px] text-[#C59B58] dark:text-[#E5C282] opacity-70">✦</span>
          <span className="absolute bottom-3 right-3.5 text-[10px] text-[#C59B58] dark:text-[#E5C282] opacity-70">✦</span>

          {/* Animated "Welcome" Calligraphy Script Header */}
          <div
            className="opacity-0 animate-calligraphy"
            style={{ animationDelay: "1.35s" }}
          >
            <span className="inline-block font-serif italic text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#9E6D2B] via-[#D4AF37] to-[#8C5A1C] dark:from-[#FFE5A3] dark:via-[#FFF6D6] to-[#D4A24B] bg-clip-text text-transparent animate-gold-shimmer">
              Welcome
            </span>
          </div>

          {/* Animated Letter-Spacing Subtitle */}
          <p
            className="text-[9px] sm:text-[10px] uppercase font-serif font-semibold text-[#8C6F47] dark:text-[#D5B57A] mt-0.5 opacity-0 animate-letter-expand"
            style={{ animationDelay: "1.55s" }}
          >
            TO THE WEDDING OF
          </p>

          {/* Animated Bride & Groom Calligraphy Names */}
          <div
            className="my-2.5 opacity-0 animate-calligraphy"
            style={{ animationDelay: "1.75s" }}
          >
            {/* Bride Name Highlight */}
            <div className="flex flex-col items-center">
              <h1 className="font-serif italic text-3xl sm:text-[34px] leading-tight font-bold bg-gradient-to-r from-[#B88746] via-[#8E5E22] to-[#B88746] dark:from-[#FFE4A3] dark:via-[#F3CB7E] dark:to-[#D4A24B] bg-clip-text text-transparent">
                {brideName}
              </h1>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 mt-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-[#F9ECEF] dark:bg-[#2D1B22] text-[#A6475B] dark:text-[#FB7185] border border-[#A6475B]/25">
                <span>The Bride</span>
                <span>👰</span>
              </span>
            </div>

            {/* Ornamental Gold Ampersand Divider */}
            <div className="my-1.5 flex items-center justify-center space-x-2">
              <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
              <span className="font-serif italic text-base text-[#B88746] dark:text-[#E5C282]">&amp;</span>
              <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
            </div>

            {/* Groom Name */}
            <h2 className="font-serif italic text-2xl sm:text-[28px] leading-tight font-semibold text-[#151515] dark:text-[#F5EADB]">
              {groomName}
            </h2>
          </div>

          {/* Date & Venue Gold Capsule */}
          <div
            className="my-2.5 py-2 px-3 rounded-xl bg-[#FAF5EE] dark:bg-[#1E1914] border border-[#E7D6C0] dark:border-[#382C1D] text-xs opacity-0 animate-calligraphy"
            style={{ animationDelay: "2.0s" }}
          >
            <p className="font-semibold text-[#151515] dark:text-[#F5EADB] text-[11px] sm:text-xs">
              {weddingDetails.weddingDate}
            </p>
            <p className="text-[10px] sm:text-[11px] text-[#666666] dark:text-[#B5A593] mt-0.5 truncate">
              📍 {weddingDetails.venueName}, {weddingDetails.city}
            </p>
          </div>

          {/* Personal Blessing Quote */}
          <p
            className="text-[11px] sm:text-xs text-[#555555] dark:text-[#C5B49E] font-serif italic leading-relaxed px-1 mb-3.5 opacity-0 animate-calligraphy line-clamp-3"
            style={{ animationDelay: "2.2s" }}
          >
            &ldquo;{welcomeText}&rdquo;
          </p>

          {/* Action Buttons */}
          <div
            className="space-y-2 relative z-30 opacity-0 animate-calligraphy"
            style={{ animationDelay: "2.4s" }}
          >
            <button
              type="button"
              onClick={() => handleSmoothDismiss(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#A6475B] via-[#C25970] to-[#A6475B] hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-md active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
            >
              <span>✨</span>
              <span>Enter Wedding Album</span>
              <span>✨</span>
            </button>

            <button
              type="button"
              onClick={() => handleSmoothDismiss(true)}
              className="w-full py-2 rounded-xl border border-[#D4AF37]/50 dark:border-[#E5C282]/30 hover:bg-[#D4AF37]/10 text-[11px] font-semibold text-[#8C6425] dark:text-[#E5C282] transition-colors"
            >
              Send a Blessing to {brideFirst} &amp; {groomFirst} 💌
            </button>
          </div>
        </div>

        {/* =================================================================
            THE 3D LUXURY ENVELOPE POCKET & ANIMATED WAX SEAL
           ================================================================= */}
        <div
          onClick={() => {
            if (stage === "sealed") setStage("opening");
          }}
          className={`relative w-full max-w-[366px] transition-all duration-1000 ease-in-out ${
            isCardElevated
              ? "-mt-14 h-20 opacity-90 scale-95"
              : "h-56 sm:h-60 opacity-100 scale-100 cursor-pointer"
          }`}
          style={{ perspective: "1000px" }}
        >
          {/* Envelope Back Interior */}
          <div className="absolute inset-0 rounded-b-2xl bg-[#E8DAC5] dark:bg-[#231C14] border border-[#D4AF37]/50 shadow-inner" />

          {/* Envelope Top Triangular Flap (3D RotateX Opening) */}
          <div
            className="absolute top-0 inset-x-0 h-32 origin-top transition-transform duration-700 ease-in-out"
            style={{
              transform: isEnvelopeOpened ? "rotateX(180deg)" : "rotateX(0deg)",
              zIndex: isEnvelopeOpened ? 5 : 30,
            }}
          >
            <svg className="w-full h-full drop-shadow-md" viewBox="0 0 366 130" preserveAspectRatio="none">
              <path
                d="M 0 0 L 183 122 L 366 0 Z"
                fill={theme === "dark" ? "#2C2319" : "#F3E7D5"}
                stroke="#D4AF37"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          {/* Envelope Front Left & Right Folded Flaps + Bottom Pocket */}
          <div className="absolute inset-0 z-25 pointer-events-none overflow-hidden rounded-b-2xl">
            <svg className="w-full h-full" viewBox="0 0 366 220" preserveAspectRatio="none">
              {/* Left Flap */}
              <path
                d="M 0 0 L 190 115 L 0 220 Z"
                fill={theme === "dark" ? "#1E1811" : "#F7EFE2"}
                stroke="#D4AF37"
                strokeWidth="1"
                strokeOpacity="0.45"
              />
              {/* Right Flap */}
              <path
                d="M 366 0 L 176 115 L 366 220 Z"
                fill={theme === "dark" ? "#1E1811" : "#F7EFE2"}
                stroke="#D4AF37"
                strokeWidth="1"
                strokeOpacity="0.45"
              />
              {/* Bottom Triangle Pocket */}
              <path
                d="M 0 220 L 183 102 L 366 220 Z"
                fill={theme === "dark" ? "#251E16" : "#EFE3D0"}
                stroke="#D4AF37"
                strokeWidth="1.2"
              />
            </svg>
          </div>

          {/* Royal Crimson-Rose & Gold Monogram Wax Seal */}
          <div
            className={`absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 z-35 flex flex-col items-center transition-all duration-500 ${
              isEnvelopeOpened
                ? "scale-75 opacity-0 pointer-events-none"
                : "scale-100 opacity-100"
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C25970] via-[#A6475B] to-[#7A2E3E] p-1 shadow-[0_6px_20px_rgba(166,71,91,0.5)] border-2 border-[#E5C282] flex items-center justify-center animate-pulse">
              <div className="w-full h-full rounded-full border border-dashed border-[#FFE4A3]/70 flex flex-col items-center justify-center text-white">
                <span className="font-serif italic font-bold text-xs tracking-tight text-[#FFE4A3]">
                  {monogram}
                </span>
                <span className="text-[8px] text-[#FFE4A3]/90">♥</span>
              </div>
            </div>
            <span className="mt-2 text-[10px] font-serif uppercase tracking-[0.25em] text-[#8C6F47] dark:text-[#E5C282]">
              Opening Invitation...
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================================
          4. BOTTOM AUTO-FADE PROGRESS BAR & FOOTER
         ===================================================================== */}
      <div className="w-full px-6 pb-4 pt-1 flex flex-col items-center z-30">
        {!autoClosePaused && (
          <div className="w-40 h-1 rounded-full bg-[#E5D3B3]/50 dark:bg-[#2E251A] overflow-hidden mb-1.5">
            <div
              key={`prog-${animKey}`}
              className="h-full bg-gradient-to-r from-[#B88746] via-[#A6475B] to-[#D4AF37] rounded-full transition-all ease-linear"
              style={{
                width: isCardElevated ? "100%" : "15%",
                transitionDuration: isCardElevated ? "5000ms" : "800ms",
              }}
            />
          </div>
        )}
        <span className="text-[9px] uppercase tracking-[0.28em] text-[#8C6F47] dark:text-[#A0907C] font-serif">
          Memoir Digital Wedding Album
        </span>
      </div>
    </div>
  );
}
