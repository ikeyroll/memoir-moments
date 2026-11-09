"use client";

import React, { useState } from "react";
import { useMemoir } from "@/context/MemoirContext";
import { DemoTrack } from "@/lib/audioService";
import { MusicNoteIcon } from "./RedesignIcons";

interface MusicPickerScreenProps {
  onBack: () => void;
  onSelectTrack: (track: DemoTrack, startSec: number, durationSec: number) => void;
  initialTrackId?: string;
}

export function MusicPickerScreen({ onBack, onSelectTrack, initialTrackId }: MusicPickerScreenProps) {
  const { audioTracks, playAudio, stopAudio, currentAudioSource } = useMemoir();
  const [activeSubTab, setActiveSubTab] = useState<"forYou" | "saved">("forYou");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedTrackIds, setSavedTrackIds] = useState<string[]>([
    audioTracks[0]?.id || "track_1",
    audioTracks[1]?.id || "track_2",
  ]);
  const [selectedTrack, setSelectedTrack] = useState<DemoTrack>(
    audioTracks.find((t) => t.id === initialTrackId) || audioTracks[0]
  );
  const [clipDuration, setClipDuration] = useState<5 | 10 | 15>(15);
  const [startSeconds, setStartSeconds] = useState(0);

  const filteredTracks = audioTracks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeSubTab === "forYou" || savedTrackIds.includes(t.id);
    return matchesSearch && matchesTab;
  });

  const isTrackPlaying = (id: string) => currentAudioSource?.trackId === id && currentAudioSource?.isPlaying;

  const handleTogglePlay = (track: DemoTrack) => {
    if (isTrackPlaying(track.id)) {
      stopAudio();
    } else {
      setSelectedTrack(track);
      playAudio(track.id, startSeconds, clipDuration, true);
    }
  };

  const handleToggleSaveTrack = (trackId: string) => {
    setSavedTrackIds((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
  };

  const handleBack = () => {
    stopAudio();
    onBack();
  };

  const handleDone = () => {
    stopAudio();
    if (selectedTrack) {
      onSelectTrack(selectedTrack, startSeconds, clipDuration);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-black text-[#151515] dark:text-[#F5F5F5] flex flex-col w-full max-w-[430px] mx-auto animate-in slide-in-from-right duration-200">
      {/* Header: Back, Add music, Done */}
      <div className="px-4 py-3.5 border-b border-[#ECECEC] dark:border-[#262626] flex items-center justify-between">
        <button onClick={handleBack} className="text-sm font-semibold text-[#151515] dark:text-white p-1">
          ←
        </button>
        <h2 className="font-semibold text-sm text-[#151515] dark:text-white">Add music</h2>
        <button
          onClick={handleDone}
          className="text-xs font-bold text-[#A6475B] dark:text-[#FB7185] hover:opacity-80 p-1"
        >
          Done
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 pb-2">
        <div className="flex items-center px-3 py-2 bg-[#F8F8F8] dark:bg-[#1A1A1A] border border-[#ECECEC] dark:border-[#262626] rounded-xl">
          <span className="text-[#666666] mr-2 text-xs">🔍</span>
          <input
            type="text"
            placeholder="Search demo tracks"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-[#151515] dark:text-white placeholder:text-[#666666] focus:outline-none"
          />
        </div>
      </div>

      {/* Tabs: For you / Saved */}
      <div className="flex items-center px-4 border-b border-[#ECECEC] dark:border-[#262626] text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab("forYou")}
          className={`py-2.5 px-4 border-b-2 transition-colors ${
            activeSubTab === "forYou" ? "border-[#A6475B] text-[#A6475B] dark:text-[#FB7185]" : "border-transparent text-[#666666]"
          }`}
        >
          For you
        </button>
        <button
          onClick={() => setActiveSubTab("saved")}
          className={`py-2.5 px-4 border-b-2 transition-colors ${
            activeSubTab === "saved" ? "border-[#A6475B] text-[#A6475B] dark:text-[#FB7185]" : "border-transparent text-[#666666]"
          }`}
        >
          Saved ({savedTrackIds.length})
        </button>
      </div>

      {/* Track List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredTracks.length === 0 ? (
          <div className="py-10 text-center text-xs text-[#666666]">
            No tracks found in this view.
          </div>
        ) : (
          filteredTracks.map((track) => {
            const playing = isTrackPlaying(track.id);
            const isSelected = selectedTrack?.id === track.id;
            const isSaved = savedTrackIds.includes(track.id);

            return (
              <div
                key={track.id}
                onClick={() => setSelectedTrack(track)}
                className={`p-3 rounded-2xl flex items-center justify-between transition-colors cursor-pointer border ${
                  isSelected
                    ? "bg-[#F9ECEF] dark:bg-[#2A1419] border-[#A6475B]/30"
                    : "bg-white dark:bg-[#141414] border-[#ECECEC] dark:border-[#262626] hover:bg-[#F8F8F8] dark:hover:bg-[#1E1E1E]"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-xl overflow-hidden bg-stone-900 flex-shrink-0 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={track.coverImage} alt={track.title} className="w-full h-full object-cover" />
                    {playing && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <MusicNoteIcon className="w-4 h-4 text-white animate-bounce" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-[#151515] dark:text-white leading-tight">{track.title}</h4>
                    <p className="text-[11px] text-[#666666] dark:text-[#A0A0A0]">{track.artist}</p>
                  </div>
                </div>

                {/* Bookmark & Play / Pause preview */}
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSaveTrack(track.id);
                    }}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors ${
                      isSaved ? "text-[#A6475B] dark:text-[#FB7185]" : "text-[#999999] hover:text-[#151515] dark:hover:text-white"
                    }`}
                    aria-label={isSaved ? "Unsave track" : "Save track"}
                  >
                    {isSaved ? "★" : "☆"}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePlay(track);
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      playing
                        ? "bg-[#A6475B] text-white"
                        : "bg-[#F8F8F8] dark:bg-[#222222] text-[#151515] dark:text-white hover:bg-[#ECECEC]"
                    }`}
                    aria-label={playing ? "Pause" : "Play preview"}
                  >
                    {playing ? "❚❚" : "▶"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Clip Selection and Waveform Area */}
      {selectedTrack && (
        <div className="p-4 bg-white border-t border-[#ECECEC] space-y-3">
          {/* Duration selector: - 15 sec + */}
          <div className="flex items-center justify-center space-x-3 text-xs">
            <span className="text-[#666666]">Clip length:</span>
            <div className="flex items-center space-x-1.5 bg-[#F8F8F8] p-1 rounded-xl border border-[#ECECEC]">
              {([5, 10, 15] as const).map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setClipDuration(dur)}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                    clipDuration === dur ? "bg-[#A6475B] text-white" : "text-[#666666]"
                  }`}
                >
                  {dur} sec
                </button>
              ))}
            </div>
          </div>

          {/* Truthful Timeline Scrubber */}
          <div className="p-3 bg-[#F8F8F8] rounded-xl border border-[#ECECEC]">
            <div className="flex items-center justify-between text-[11px] text-[#666666] mb-1 font-mono">
              <span>0:{startSeconds < 10 ? `0${startSeconds}` : startSeconds}</span>
              <span className="font-semibold text-[#151515] truncate max-w-[140px]">{selectedTrack.title}</span>
              <span>0:{Math.min(selectedTrack.durationSeconds, startSeconds + clipDuration)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={Math.max(0, selectedTrack.durationSeconds - clipDuration)}
              value={startSeconds}
              onChange={(e) => setStartSeconds(Number(e.target.value))}
              className="w-full accent-[#A6475B]"
            />
          </div>

          {/* Use This Track Button */}
          <button
            type="button"
            onClick={handleDone}
            className="w-full py-3.5 bg-[#A6475B] text-white rounded-xl text-xs font-bold hover:opacity-95 transition-opacity"
          >
            Use this track
          </button>
        </div>
      )}
    </div>
  );
}

