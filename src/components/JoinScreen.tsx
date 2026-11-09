"use client";

import React, { useState } from "react";
import { useMemoir } from "@/context/MemoirContext";
import { SAMPLE_WEDDING_PHOTOS } from "@/lib/sampleData";

export function JoinScreen({ onEnter }: { onEnter: () => void }) {
  const { weddingDetails, loginGuest } = useMemoir();
  const [nickname, setNickname] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = loginGuest(nickname, pin || weddingDetails.guestPin);
    if (res.success) {
      onEnter();
    } else {
      setError(res.error || "Unable to join wedding.");
    }
  };

  const handleDemoQuickEntry = () => {
    loginGuest("Aisyah", weddingDetails.guestPin);
    onEnter();
  };

  return (
    <div className="min-h-dvh bg-white text-[#151515] flex flex-col justify-between max-w-[430px] mx-auto">
      {/* Upper Photo Section */}
      <div className="relative w-full h-[48dvh] overflow-hidden bg-stone-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={weddingDetails.coverPhotoUrl || SAMPLE_WEDDING_PHOTOS.couple_cover}
          alt={weddingDetails.coupleNames}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Small Memoir branding on photo */}
        <div className="absolute top-6 left-6 text-white">
          <span className="font-serif italic font-bold text-2xl tracking-tight text-white drop-shadow">
            Memoir
          </span>
          <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-white/80 block -mt-1">
            by FACEZ
          </span>
        </div>

        {/* Couple & Date Overlay */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#FFE5A3] block mb-0.5">
            Wedding Celebration
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            {weddingDetails.coupleNames}
          </h1>
          <p className="text-xs text-white/95 font-medium mt-0.5">
            Bride: <strong>{weddingDetails.brideName || weddingDetails.partnerOne || "Farah"}</strong> • Groom: {weddingDetails.groomName || weddingDetails.partnerTwo || "Daniyal"}
          </p>
          <p className="text-xs text-white/80 mt-1 line-clamp-1">
            📍 {weddingDetails.weddingDate} • {weddingDetails.venueName}
          </p>
        </div>
      </div>

      {/* Lower Entry Form Section */}
      <div className="p-6 flex-1 flex flex-col justify-between bg-white dark:bg-black text-[#151515] dark:text-[#F5F5F5] transition-colors">
        <div>
          <p className="text-sm text-[#666666] dark:text-[#A0A0A0] mb-5 leading-relaxed">
            Welcome to our live wedding album. Enter your name to share photos, browse guest memories and sign our guestbook.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="p-2.5 bg-rose-50 text-[#A6475B] text-xs rounded-xl font-medium border border-rose-100">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="guest-nickname" className="block text-xs font-semibold text-[#151515] dark:text-[#E0E0E0] uppercase tracking-wider mb-1">
                Your Nickname
              </label>
              <input
                id="guest-nickname"
                type="text"
                placeholder="e.g. Aisyah, Uncle Sam, Zayd"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-3.5 py-3 text-sm bg-white dark:bg-[#181818] border border-[#ECECEC] dark:border-[#2C2C2E] rounded-xl text-[#151515] dark:text-white focus:outline-none focus:border-[#A6475B]"
                required
              />
            </div>

            <div>
              <label htmlFor="guest-pin" className="block text-xs font-semibold text-[#151515] dark:text-[#E0E0E0] uppercase tracking-wider mb-1">
                Wedding PIN <span className="text-[#666666] dark:text-[#888888] font-normal lowercase">(optional for demo)</span>
              </label>
              <input
                id="guest-pin"
                type="text"
                placeholder="Demo PIN: 2026"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-3.5 py-3 text-sm bg-white dark:bg-[#181818] border border-[#ECECEC] dark:border-[#2C2C2E] rounded-xl text-[#151515] dark:text-white focus:outline-none focus:border-[#A6475B] font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#151515] dark:bg-white text-white dark:text-[#151515] rounded-xl text-sm font-semibold hover:opacity-90 transition-colors"
            >
              Join the wedding
            </button>
          </form>

          {/* Quick Demo Entry Button */}
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={handleDemoQuickEntry}
              className="text-xs font-semibold text-[#A6475B] dark:text-[#FB7185] hover:underline py-1"
            >
              Instant Demo Access (as Aisyah) →
            </button>
          </div>
        </div>

        {/* Small Disclosure */}
        <div className="pt-4 text-center">
          <p className="text-[11px] text-[#666666] dark:text-[#888888] leading-snug">
            <strong>About this demo:</strong> Runs locally in your browser using IndexedDB. Uploads stay on this device and are not shared across phones.
          </p>
        </div>
      </div>
    </div>
  );
}

