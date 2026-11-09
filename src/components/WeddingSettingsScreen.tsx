"use client";

import React, { useState, useRef } from "react";
import { useMemoir } from "@/context/MemoirContext";
import { SAMPLE_WEDDING_PHOTOS } from "@/lib/sampleData";

const PRESET_COVERS = [
  SAMPLE_WEDDING_PHOTOS.couple_cover,
  SAMPLE_WEDDING_PHOTOS.nikah_vows,
  SAMPLE_WEDDING_PHOTOS.reception_hall,
  SAMPLE_WEDDING_PHOTOS.nikah_bride,
];

export function WeddingSettingsScreen() {
  const {
    weddingDetails,
    updateWeddingDetails,
    setIsWeddingSettingsOpen,
    setIsWelcomeSplashOpen,
    resetDemoData,
    theme,
    toggleTheme,
  } = useMemoir();

  const coverFileInputRef = useRef<HTMLInputElement | null>(null);

  // Settings form state
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(
    weddingDetails.coverPhotoUrl || SAMPLE_WEDDING_PHOTOS.couple_cover
  );
  const [coupleNames, setCoupleNames] = useState(weddingDetails.coupleNames);
  const [brideName, setBrideName] = useState(weddingDetails.brideName || weddingDetails.partnerOne || "Farah");
  const [groomName, setGroomName] = useState(weddingDetails.groomName || weddingDetails.partnerTwo || "Daniyal");
  const [invitationHeadline, setInvitationHeadline] = useState(weddingDetails.invitationHeadline || "Welcome to the Wedding of Farah & Daniyal");
  const [invitationWelcomeNote, setInvitationWelcomeNote] = useState(weddingDetails.invitationWelcomeNote || weddingDetails.welcomeNote || "");
  const [weddingDate, setWeddingDate] = useState(weddingDetails.weddingDate || "14 November 2026");
  const [approvalRequired, setApprovalRequired] = useState(weddingDetails.requirePostApproval);
  const [weddingPin, setWeddingPin] = useState(weddingDetails.guestPin);
  const [allowDownloads, setAllowDownloads] = useState(weddingDetails.allowGuestDownloads);
  const [eventMusic, setEventMusic] = useState(weddingDetails.enableEventMusic);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isResetConfirming, setIsResetConfirming] = useState(false);

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCoverPhotoUrl(reader.result);
        updateWeddingDetails({ coverPhotoUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCyclePresetCover = () => {
    const idx = PRESET_COVERS.indexOf(coverPhotoUrl);
    const nextUrl = PRESET_COVERS[(idx + 1) % PRESET_COVERS.length];
    setCoverPhotoUrl(nextUrl);
    updateWeddingDetails({ coverPhotoUrl: nextUrl });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateWeddingDetails({
      coverPhotoUrl,
      coupleNames,
      partnerOne: brideName,
      partnerTwo: groomName,
      brideName,
      groomName,
      invitationHeadline,
      invitationWelcomeNote,
      weddingDate,
      requirePostApproval: approvalRequired,
      guestPin: weddingPin,
      allowGuestDownloads: allowDownloads,
      enableEventMusic: eventMusic,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-black text-[#151515] dark:text-[#F5F5F5] flex flex-col max-w-[430px] mx-auto animate-in slide-in-from-right duration-200">
      {/* Header: Screen 12 Wedding settings */}
      <div className="px-4 py-3.5 border-b border-[#ECECEC] dark:border-[#262626] flex items-center justify-between">
        <button
          onClick={() => setIsWeddingSettingsOpen(false)}
          className="text-sm font-semibold text-[#151515] dark:text-white p-1 hover:opacity-75"
        >
          ←
        </button>
        <h2 className="font-semibold text-sm text-[#151515] dark:text-[#F5F5F5]">Wedding settings</h2>
        <button
          onClick={handleSave}
          className="text-xs font-bold text-[#A6475B] dark:text-[#FB7185] hover:opacity-80 p-1"
        >
          Save
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {saveSuccess && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl font-medium border border-emerald-100 dark:border-emerald-800">
            Settings saved successfully!
          </div>
        )}

        {/* Cover Photo Preview & Change cover button */}
        <div className="flex items-center space-x-3.5 p-3 bg-[#F8F8F8] dark:bg-[#1A1A1A] rounded-2xl border border-[#ECECEC] dark:border-[#262626]">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-900 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverPhotoUrl} alt="Cover" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-xs text-[#151515] dark:text-white">Wedding cover</h3>
            <p className="text-[11px] text-[#666666] dark:text-[#888888] mb-1.5">Shown on your wedding join screen & studio</p>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => coverFileInputRef.current?.click()}
                className="text-xs font-semibold text-[#A6475B] dark:text-[#FB7185] hover:underline"
              >
                Upload cover
              </button>
              <span className="text-[#CCCCCC] dark:text-[#444444]">•</span>
              <button
                type="button"
                onClick={handleCyclePresetCover}
                className="text-xs font-semibold text-[#666666] dark:text-[#A0A0A0] hover:text-[#151515] dark:hover:text-white"
              >
                Switch preset
              </button>
              <input
                ref={coverFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverFileChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Form Inputs: Couple names & Wedding date */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[#151515] dark:text-[#D1D1D1] uppercase tracking-wider mb-1">
              Couple names
            </label>
            <input
              type="text"
              value={coupleNames}
              onChange={(e) => setCoupleNames(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-[#1A1A1A] border border-[#ECECEC] dark:border-[#262626] rounded-xl text-[#151515] dark:text-white focus:outline-none focus:border-[#A6475B] dark:focus:border-[#FB7185]"
            />
          </div>

          {/* Bride & Groom Customization */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-[#151515] dark:text-[#D1D1D1] uppercase tracking-wider mb-1">
                Bride&apos;s Name 👰
              </label>
              <input
                type="text"
                value={brideName}
                onChange={(e) => setBrideName(e.target.value)}
                placeholder="Bride name (e.g. Farah)"
                className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1A1A1A] border border-[#ECECEC] dark:border-[#262626] rounded-xl text-[#151515] dark:text-white focus:outline-none focus:border-[#A6475B]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#151515] dark:text-[#D1D1D1] uppercase tracking-wider mb-1">
                Groom&apos;s Name 🤵
              </label>
              <input
                type="text"
                value={groomName}
                onChange={(e) => setGroomName(e.target.value)}
                placeholder="Groom name (e.g. Daniyal)"
                className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1A1A1A] border border-[#ECECEC] dark:border-[#262626] rounded-xl text-[#151515] dark:text-white focus:outline-none focus:border-[#A6475B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#151515] dark:text-[#D1D1D1] uppercase tracking-wider mb-1">
              Wedding date
            </label>
            <input
              type="text"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-[#1A1A1A] border border-[#ECECEC] dark:border-[#262626] rounded-xl text-[#151515] dark:text-white focus:outline-none focus:border-[#A6475B] dark:focus:border-[#FB7185]"
            />
          </div>

          {/* Welcome Invitation Card Customization */}
          <div className="p-3 bg-[#FBF9F5] dark:bg-[#181512] rounded-2xl border border-[#E7D6C0] dark:border-[#382C1D] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8C6425] dark:text-[#E8BE70] uppercase tracking-wider">
                Welcome Invitation Card
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsWelcomeSplashOpen(true);
                  setIsWeddingSettingsOpen(false);
                }}
                className="px-2.5 py-1 rounded-full bg-[#B88746] hover:bg-[#9E6D2B] text-white text-[10px] font-bold shadow-xs active:scale-95 transition-all"
              >
                Preview Invitation ✨
              </button>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#666666] dark:text-[#A0A0A0] mb-0.5">
                Invitation Headline
              </label>
              <input
                type="text"
                value={invitationHeadline}
                onChange={(e) => setInvitationHeadline(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-[#141210] border border-[#E0D7CB] dark:border-[#2E251A] rounded-xl text-[#151515] dark:text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#666666] dark:text-[#A0A0A0] mb-0.5">
                Personal Bride & Groom Welcome Message
              </label>
              <textarea
                rows={2}
                value={invitationWelcomeNote}
                onChange={(e) => setInvitationWelcomeNote(e.target.value)}
                className="w-full p-2 text-xs bg-white dark:bg-[#141210] border border-[#E0D7CB] dark:border-[#2E251A] rounded-xl text-[#151515] dark:text-white focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Settings Toggles List */}
        <div className="space-y-3 pt-2 border-t border-[#ECECEC] dark:border-[#262626]">
          {/* Approval required */}
          <div className="flex items-center justify-between p-3 rounded-2xl border border-[#ECECEC] dark:border-[#262626] bg-white dark:bg-[#141414]">
            <div className="pr-3">
              <span className="block font-bold text-xs text-[#151515] dark:text-white">Approval required</span>
              <span className="block text-[11px] text-[#666666] dark:text-[#888888]">Review photos before they appear on your wedding page</span>
            </div>
            <button
              type="button"
              onClick={() => setApprovalRequired(!approvalRequired)}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                approvalRequired ? "bg-[#A6475B]" : "bg-stone-300 dark:bg-stone-700"
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${approvalRequired ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>

          {/* Wedding PIN */}
          <div className="flex items-center justify-between p-3 rounded-2xl border border-[#ECECEC] dark:border-[#262626] bg-white dark:bg-[#141414]">
            <div className="pr-3">
              <span className="block font-bold text-xs text-[#151515] dark:text-white">Wedding PIN</span>
              <span className="block text-[11px] text-[#666666] dark:text-[#888888]">Let only invited guests join (PIN: {weddingPin})</span>
            </div>
            <button
              type="button"
              onClick={() => setWeddingPin(weddingPin ? "" : "2026")}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                Boolean(weddingPin) ? "bg-[#A6475B]" : "bg-stone-300 dark:bg-stone-700"
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${Boolean(weddingPin) ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>

          {/* Allow guest downloads */}
          <div className="flex items-center justify-between p-3 rounded-2xl border border-[#ECECEC] dark:border-[#262626] bg-white dark:bg-[#141414]">
            <div className="pr-3">
              <span className="block font-bold text-xs text-[#151515] dark:text-white">Allow guest downloads</span>
              <span className="block text-[11px] text-[#666666] dark:text-[#888888]">Guests can save photos to their device</span>
            </div>
            <button
              type="button"
              onClick={() => setAllowDownloads(!allowDownloads)}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                allowDownloads ? "bg-[#A6475B]" : "bg-stone-300 dark:bg-stone-700"
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${allowDownloads ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>

          {/* Event music */}
          <div className="flex items-center justify-between p-3 rounded-2xl border border-[#ECECEC] dark:border-[#262626] bg-white dark:bg-[#141414]">
            <div className="pr-3">
              <span className="block font-bold text-xs text-[#151515] dark:text-white">Event music</span>
              <span className="block text-[11px] text-[#666666] dark:text-[#888888]">Play soft instrumental acoustic track on page</span>
            </div>
            <button
              type="button"
              onClick={() => setEventMusic(!eventMusic)}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                eventMusic ? "bg-[#A6475B]" : "bg-stone-300 dark:bg-stone-700"
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${eventMusic ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>

          {/* Dark Mode Theme Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl border border-[#ECECEC] dark:border-[#262626] bg-white dark:bg-[#141414]">
            <div className="pr-3">
              <span className="block font-bold text-xs text-[#151515] dark:text-white">Dark mode</span>
              <span className="block text-[11px] text-[#666666] dark:text-[#888888]">Instagram OLED black theme</span>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                theme === "dark" ? "bg-[#A6475B]" : "bg-stone-300 dark:bg-stone-700"
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${theme === "dark" ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
        </div>

        {/* Reset Demo Section */}
        <div className="pt-4 border-t border-[#ECECEC] dark:border-[#262626]">
          <div className="p-3.5 bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-2xl">
            <h4 className="font-bold text-xs text-[#A6475B] dark:text-[#FB7185]">Reset Demo Data</h4>
            <p className="text-[11px] text-[#666666] dark:text-[#A0A0A0] mt-0.5 mb-2.5">
              Clears local IndexedDB uploads and restores initial sample wedding content.
            </p>
            {!isResetConfirming ? (
              <button
                type="button"
                onClick={() => setIsResetConfirming(true)}
                className="px-3.5 py-1.5 bg-[#A6475B] text-white rounded-xl text-xs font-bold hover:bg-rose-700"
              >
                Reset demo data
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    resetDemoData();
                    setIsResetConfirming(false);
                  }}
                  className="px-3.5 py-1.5 bg-rose-700 text-white rounded-xl text-xs font-bold"
                >
                  Confirm reset
                </button>
                <button
                  type="button"
                  onClick={() => setIsResetConfirming(false)}
                  className="px-3 py-1.5 border border-rose-300 dark:border-rose-800 text-xs rounded-xl text-[#666666] dark:text-stone-300"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

