"use client";

import React, { useState, useRef, useEffect } from "react";
import { useMemoir } from "@/context/MemoirContext";
import { MusicPickerScreen } from "./MusicPickerScreen";
import { AttachedTrackInfo, CropSettings, FilterAdjustments, MediaItem } from "@/lib/types";
import { SAMPLE_WEDDING_PHOTOS } from "@/lib/sampleData";

// Curated library samples for fast preview selection & demo testing
const CURATED_DEVICE_LIBRARY: { id: string; url: string; title: string; isVideo?: boolean }[] = [
  { id: "lib_1", url: SAMPLE_WEDDING_PHOTOS.nikah_vows, title: "Ceremony Vows" },
  { id: "lib_2", url: SAMPLE_WEDDING_PHOTOS.nikah_rings, title: "Rings Exchange" },
  { id: "lib_3", url: SAMPLE_WEDDING_PHOTOS.nikah_bride, title: "Bridal Portrait" },
  { id: "lib_4", url: SAMPLE_WEDDING_PHOTOS.reception_hall, title: "Grand Hall" },
  { id: "lib_5", url: SAMPLE_WEDDING_PHOTOS.reception_table, title: "Banquet Setting" },
  { id: "lib_6", url: SAMPLE_WEDDING_PHOTOS.reception_cake, title: "Tiered Cake" },
  { id: "lib_7", url: SAMPLE_WEDDING_PHOTOS.family_parents, title: "Parent Blessing" },
  { id: "lib_8", url: SAMPLE_WEDDING_PHOTOS.family_embrace, title: "Family Hug" },
  { id: "lib_9", url: SAMPLE_WEDDING_PHOTOS.friends_bridesmaids, title: "Bridesmaids" },
  { id: "lib_10", url: SAMPLE_WEDDING_PHOTOS.friends_groomsmen, title: "Groomsmen" },
  { id: "lib_11", url: SAMPLE_WEDDING_PHOTOS.friends_laughter, title: "Candid Cheers" },
  { id: "lib_12", url: SAMPLE_WEDDING_PHOTOS.couple_profile, title: "Portraits" },
];

// IG Filter Presets
interface FilterPreset {
  name: string;
  adjustments: FilterAdjustments;
  label: string;
}

const FILTER_PRESETS: FilterPreset[] = [
  { name: "normal", label: "Normal", adjustments: { brightness: 0, contrast: 0, warmth: 0 } },
  { name: "warm_rose", label: "Warm Rose", adjustments: { brightness: 5, contrast: 10, warmth: 25 } },
  { name: "clarendon", label: "Clarendon", adjustments: { brightness: 10, contrast: 20, warmth: 0 } },
  { name: "vintage", label: "Vintage", adjustments: { brightness: -5, contrast: -5, warmth: 35 } },
  { name: "monochrome", label: "Silver", adjustments: { brightness: 0, contrast: 25, warmth: 0 } },
];

export function CreateMemoryFlow() {
  const {
    isCreateMemoryOpen,
    setIsCreateMemoryOpen,
    createMemoryInitialMode,
    session,
    highlights,
    createPost,
    createStory,
  } = useMemoir();

  // Screens: select (05) -> edit (06) -> music (07) -> publish
  const [currentScreen, setCurrentScreen] = useState<"select" | "edit" | "music" | "publish">("select");
  const [musicReturnScreen, setMusicReturnScreen] = useState<"edit" | "publish">("edit");
  const [mode, setMode] = useState<"post" | "story">("post");

  // Synchronize mode whenever create memory flow is opened
  useEffect(() => {
    if (isCreateMemoryOpen) {
      setMode(createMemoryInitialMode || "post");
      setCurrentScreen("select");
      setIsMultiSelect(false);
    }
  }, [isCreateMemoryOpen, createMemoryInitialMode]);

  // Multi-select toggle (like IG's overlapping squares icon)
  const [isMultiSelect, setIsMultiSelect] = useState(false);

  // Selected media queue with sequential order (up to 10 items)
  const [selectedQueue, setSelectedQueue] = useState<MediaItem[]>([
    { id: "seed_1", dataUrl: CURATED_DEVICE_LIBRARY[0].url, mimeType: "image/jpeg" },
  ]);
  const [activePreviewIdx, setActivePreviewIdx] = useState(0);

  // Edit tools state (Screen 06)
  const [activeTool, setActiveTool] = useState<"crop" | "adjust" | "music" | "text" | "filter" | null>("filter");
  const [crop, setCrop] = useState<CropSettings>({ aspectRatio: "4:5", zoom: 1, offsetX: 0, offsetY: 0 });
  const [adjustments, setAdjustments] = useState<FilterAdjustments>({ brightness: 0, contrast: 0, warmth: 0 });
  const [activePreset, setActivePreset] = useState("normal");
  const [attachedTrack, setAttachedTrack] = useState<AttachedTrackInfo | null>(null);
  const [textOverlay, setTextOverlay] = useState("");

  // Publish form
  const [caption, setCaption] = useState("");
  const [highlightId, setHighlightId] = useState(highlights[0]?.id || "hl_nikah");
  const [locationTag, setLocationTag] = useState("The Glasshouse at Seputeh");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isCreateMemoryOpen) return null;

  // Real device file picker (supports multiple images and videos from camera roll)
  const handleDeviceFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const newItems: MediaItem[] = [];

    for (const file of fileList) {
      if (selectedQueue.length + newItems.length >= 10) break;
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");
      if (!isImage && !isVideo) continue;

      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      newItems.push({
        id: `upload_${Date.now()}_${Math.random()}`,
        dataUrl,
        mimeType: file.type,
        isVideo,
      });
    }

    if (newItems.length > 0) {
      if (isMultiSelect) {
        setSelectedQueue((prev) => [...prev, ...newItems]);
        setActivePreviewIdx(selectedQueue.length);
      } else {
        setSelectedQueue([newItems[0]]);
        setActivePreviewIdx(0);
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Toggle selection from curated library
  const handleSelectLibraryItem = (libItem: { id: string; url: string; isVideo?: boolean }) => {
    if (!isMultiSelect) {
      // Single select: immediate preview switch
      const newItem: MediaItem = {
        id: `item_${Date.now()}_${Math.random()}`,
        dataUrl: libItem.url,
        mimeType: libItem.isVideo ? "video/mp4" : "image/jpeg",
        isVideo: libItem.isVideo,
      };
      setSelectedQueue([newItem]);
      setActivePreviewIdx(0);
      return;
    }

    // Multi-select mode
    const existingIdx = selectedQueue.findIndex((item) => item.dataUrl === libItem.url);
    if (existingIdx >= 0) {
      if (selectedQueue.length > 1) {
        setSelectedQueue((prev) => prev.filter((_, idx) => idx !== existingIdx));
        setActivePreviewIdx(0);
      }
    } else {
      if (selectedQueue.length < 10) {
        const newItem: MediaItem = {
          id: `item_${Date.now()}_${Math.random()}`,
          dataUrl: libItem.url,
          mimeType: libItem.isVideo ? "video/mp4" : "image/jpeg",
          isVideo: libItem.isVideo,
        };
        setSelectedQueue((prev) => [...prev, newItem]);
        setActivePreviewIdx(selectedQueue.length);
      }
    }
  };

  const handleClose = () => {
    setIsCreateMemoryOpen(false);
    setSelectedQueue([{ id: "seed_1", dataUrl: CURATED_DEVICE_LIBRARY[0].url, mimeType: "image/jpeg" }]);
    setCurrentScreen("select");
    setActiveTool("filter");
    setAttachedTrack(null);
    setTextOverlay("");
    setCaption("");
    setErrorMsg(null);
  };

  const handlePublishStory = async () => {
    if (selectedQueue.length === 0) return;
    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await createStory({
      mediaDataUrl: selectedQueue[0].dataUrl,
      mimeType: selectedQueue[0].mimeType,
      isVideo: selectedQueue[0].isVideo,
      caption: textOverlay || "",
      attachedTrack: attachedTrack || undefined,
      highlightId,
    });
    setIsSubmitting(false);
    if (res.success) {
      handleClose();
    } else {
      setErrorMsg("Failed to upload story.");
    }
  };

  const handlePublish = async () => {
    if (selectedQueue.length === 0) return;
    setIsSubmitting(true);
    setErrorMsg(null);

    if (mode === "story") {
      await handlePublishStory();
      return;
    }

    const res = await createPost({
      mediaFiles: selectedQueue.map((item) => ({
        dataUrl: item.dataUrl,
        mimeType: item.mimeType,
        sizeBytes: 250000,
      })),
      caption,
      highlightId,
      locationTag: locationTag.trim() || undefined,
      attachedTrack: attachedTrack || undefined,
      cropSettings: crop,
      filterAdjustments: adjustments,
      textOverlay: textOverlay || undefined,
    });
    setIsSubmitting(false);
    if (res.success) {
      handleClose();
    } else {
      setErrorMsg(res.error || "Failed to publish memory.");
    }
  };

  const currentPreview = selectedQueue[activePreviewIdx] || selectedQueue[0];

  const filterStyle: React.CSSProperties = {
    filter: `brightness(${100 + adjustments.brightness}%) contrast(${100 + adjustments.contrast}%) sepia(${Math.max(0, adjustments.warmth)}%) ${activePreset === "monochrome" ? "grayscale(100%)" : ""}`,
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-black text-[#151515] dark:text-[#F5F5F5] flex flex-col w-full max-w-[430px] mx-auto animate-in fade-in-0 duration-150 overscroll-none">
      {/* SCREEN 05: SELECT PHOTOS / VIDEOS */}
      {currentScreen === "select" && (
        <div className="flex-1 flex flex-col justify-between h-full bg-white dark:bg-black">
          {/* Header: X, New memory, Next */}
          <div className="px-4 py-3.5 border-b border-[#ECECEC] dark:border-[#262626] flex items-center justify-between">
            <button
              onClick={handleClose}
              className="text-lg text-[#151515] dark:text-white p-1 font-bold active:opacity-60"
              aria-label="Close"
            >
              ✕
            </button>
            <h2 className="font-semibold text-sm text-[#151515] dark:text-white">
              {mode === "story" ? "New story" : "New memory"}
            </h2>
            <button
              disabled={selectedQueue.length === 0}
              onClick={() => setCurrentScreen("edit")}
              className="text-xs font-bold text-[#A6475B] dark:text-[#FB7185] disabled:opacity-30 hover:opacity-80 p-1"
            >
              Next
            </button>
          </div>

          {/* Main Top Large Preview (Edge-to-edge, smooth 4:5 or 1:1) */}
          <div className={`relative ${crop.aspectRatio === "square" ? "aspect-square" : "aspect-[4/5]"} max-h-[50dvh] bg-stone-950 overflow-hidden flex items-center justify-center transition-all duration-200`}>
            {currentPreview ? (
              currentPreview.isVideo ? (
                <video
                  src={currentPreview.dataUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={currentPreview.dataUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <div className="text-center text-white text-xs">Select photo to preview</div>
            )}

            {/* Carousel Order Badge Overlay */}
            {selectedQueue.length > 1 && (
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-[11px] font-mono tracking-wider backdrop-blur-sm z-10">
                {activePreviewIdx + 1}/{selectedQueue.length}
              </div>
            )}

            {/* Quick 1:1 vs 4:5 Aspect Ratio Toggle (IG Lower Left Button) */}
            <button
              type="button"
              onClick={() => setCrop((c) => ({ ...c, aspectRatio: c.aspectRatio === "4:5" ? "square" : "4:5" }))}
              className="absolute bottom-3 left-3 px-2 py-1 rounded-full bg-black/60 text-white text-[10px] font-mono hover:bg-black/80 flex items-center space-x-1 backdrop-blur-sm z-10"
              aria-label="Toggle ratio preview"
            >
              <span>{crop.aspectRatio === "4:5" ? "4:5" : "1:1"}</span>
            </button>
          </div>

          {/* Device Library & Instagram-Style Multi-Select Bar */}
          <div className="p-3 flex-1 flex flex-col justify-between overflow-hidden bg-white dark:bg-black">
            <div className="flex items-center justify-between py-1.5 mb-1.5 border-b border-[#ECECEC] dark:border-[#262626]">
              {/* Left: Album Title */}
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-[#151515] dark:text-white">Wedding Gallery</span>
                <span className="text-[10px] text-[#666666] dark:text-[#888888] font-mono">
                  {selectedQueue.length > 1 ? `${selectedQueue.length} selected` : ""}
                </span>
              </div>

              {/* Right: IG Multi-Select Overlapping Icon + Choose from Device Button */}
              <div className="flex items-center space-x-2">
                {/* Instagram Overlapping Squares Multi-Select Toggle */}
                {mode === "post" && (
                  <button
                    type="button"
                    onClick={() => {
                      if (isMultiSelect && selectedQueue.length > 1) {
                        // Collapse to first
                        setSelectedQueue([selectedQueue[0]]);
                        setActivePreviewIdx(0);
                      }
                      setIsMultiSelect(!isMultiSelect);
                    }}
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                      isMultiSelect
                        ? "bg-[#A6475B] text-white shadow-sm"
                        : "bg-[#F8F8F8] dark:bg-[#1A1A1A] text-[#151515] dark:text-white border border-[#ECECEC] dark:border-[#262626] hover:bg-stone-100 dark:hover:bg-stone-800"
                    }`}
                    aria-label="Select multiple photos"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="7" y="7" width="14" height="14" rx="2" />
                      <path d="M4 17V5a2 2 0 0 1 2-2h12" />
                    </svg>
                    <span>{isMultiSelect ? "Multiple" : "Select"}</span>
                  </button>
                )}

                {/* Real Device File / Camera Picker */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#A6475B]/10 dark:bg-[#FB7185]/15 text-[#A6475B] dark:text-[#FB7185] hover:bg-[#A6475B]/20 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <span>Upload</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple={isMultiSelect}
                  accept="image/*,video/*"
                  onChange={handleDeviceFiles}
                  className="hidden"
                />
              </div>
            </div>

            {/* Smooth 4-column thumbnail grid with numbered order badges */}
            <div className="grid grid-cols-4 gap-1.5 overflow-y-auto flex-1 no-scrollbar pr-0.5">
              {CURATED_DEVICE_LIBRARY.map((item) => {
                const orderIdx = selectedQueue.findIndex((q) => q.dataUrl === item.url);
                const isSelected = orderIdx >= 0;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectLibraryItem(item)}
                    className="relative aspect-square rounded-lg overflow-hidden border border-[#ECECEC] dark:border-[#262626] focus:outline-none bg-stone-900 group transition-transform active:scale-95"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:opacity-90" />
                    {isSelected && (
                      <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#A6475B] text-white text-[10px] font-bold flex items-center justify-center shadow">
                        {isMultiSelect ? orderIdx + 1 : "✓"}
                      </span>
                    )}
                    {item.isVideo && (
                      <span className="absolute bottom-1 left-1 px-1 bg-black/60 rounded text-[9px] text-white font-mono">
                        ▶
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom Mode Selector: Post vs Story */}
            <div className="pt-2 pb-1 flex items-center justify-center">
              <div className="flex rounded-full bg-[#F8F8F8] dark:bg-[#1A1A1A] p-1 border border-[#ECECEC] dark:border-[#262626]">
                <button
                  type="button"
                  onClick={() => setMode("post")}
                  className={`px-6 py-1.5 rounded-full text-xs font-bold transition-all ${
                    mode === "post" ? "bg-[#A6475B] text-white shadow-sm" : "text-[#666666] dark:text-[#888888]"
                  }`}
                >
                  Post
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("story");
                    setIsMultiSelect(false);
                    if (selectedQueue.length > 1) {
                      setSelectedQueue([selectedQueue[0]]);
                    }
                  }}
                  className={`px-6 py-1.5 rounded-full text-xs font-bold transition-all ${
                    mode === "story" ? "bg-[#A6475B] text-white shadow-sm" : "text-[#666666] dark:text-[#888888]"
                  }`}
                >
                  Story
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 06: EDIT MEMORY */}
      {currentScreen === "edit" && (
        <div className="flex-1 flex flex-col justify-between h-full bg-white dark:bg-black">
          {/* Header: Back, Edit memory, Next/Share */}
          <div className="px-4 py-3.5 border-b border-[#ECECEC] dark:border-[#262626] flex items-center justify-between">
            <button onClick={() => setCurrentScreen("select")} className="text-sm font-semibold text-[#151515] dark:text-white p-1">
              ←
            </button>
            <h2 className="font-semibold text-sm text-[#151515] dark:text-white">
              {mode === "story" ? "Edit story" : "Edit memory"}
            </h2>
            {mode === "story" ? (
              <button
                type="button"
                onClick={handlePublishStory}
                disabled={isSubmitting}
                className="text-xs font-bold text-[#A6475B] dark:text-[#FB7185] hover:opacity-80 p-1"
              >
                {isSubmitting ? "Sharing..." : "Share"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentScreen("publish")}
                className="text-xs font-bold text-[#A6475B] dark:text-[#FB7185] hover:opacity-80 p-1"
              >
                Next
              </button>
            )}
          </div>

          {/* Carousel Preview Strip for Multi-Photo Posts */}
          {selectedQueue.length > 1 && (
            <div className="px-3 py-2 bg-[#F8F8F8] border-b border-[#ECECEC] flex items-center space-x-2 overflow-x-auto no-scrollbar">
              {selectedQueue.map((item, idx) => (
                <button
                  key={item.id || idx}
                  onClick={() => setActivePreviewIdx(idx)}
                  className={`relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    activePreviewIdx === idx ? "border-[#A6475B] scale-105" : "border-transparent opacity-60"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.dataUrl} alt="Thumb" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 right-0 px-1 text-[9px] bg-black/70 text-white font-mono">
                    {idx + 1}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Large Preview with active filters / text overlay */}
          <div className="relative flex-1 bg-stone-950 flex items-center justify-center overflow-hidden">
            {currentPreview && (
              currentPreview.isVideo ? (
                <video
                  src={currentPreview.dataUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={filterStyle}
                  className="max-h-full max-w-full object-cover"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={currentPreview.dataUrl}
                  alt="Editing"
                  style={filterStyle}
                  className={`max-h-full max-w-full object-cover ${crop.aspectRatio === "square" ? "aspect-square" : "aspect-[4/5]"}`}
                />
              )
            )}

            {/* Interactive Text Overlay */}
            {textOverlay && (
              <div className="absolute inset-x-6 bottom-16 text-center pointer-events-none">
                <span className="inline-block px-4 py-1.5 rounded-xl bg-black/60 text-white font-serif italic text-lg drop-shadow">
                  {textOverlay}
                </span>
              </div>
            )}
          </div>

          {/* Attached Music Bar (as in Screen 06 Board 2) */}
          {attachedTrack && (
            <div className="px-4 py-2 bg-[#F9ECEF] border-t border-[#A6475B]/20 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span>🎵</span>
                <span className="font-semibold text-[#151515]">{attachedTrack.title}</span>
                <span className="text-[#666666]">({attachedTrack.durationSeconds}s clip)</span>
              </div>
              <button
                type="button"
                onClick={() => setAttachedTrack(null)}
                className="text-[#A6475B] font-bold text-xs"
              >
                Remove
              </button>
            </div>
          )}

          {/* Filter Presets Row (IG Filter Bar) */}
          {activeTool === "filter" && (
            <div className="p-3 bg-[#F8F8F8] border-t border-[#ECECEC] flex items-center space-x-3 overflow-x-auto no-scrollbar">
              {FILTER_PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => {
                    setActivePreset(p.name);
                    setAdjustments(p.adjustments);
                  }}
                  className={`flex flex-col items-center flex-shrink-0 transition-transform ${
                    activePreset === p.name ? "scale-105" : "opacity-70"
                  }`}
                >
                  <div className={`w-14 h-14 rounded-lg overflow-hidden border-2 mb-1 ${
                    activePreset === p.name ? "border-[#A6475B]" : "border-[#ECECEC]"
                  }`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentPreview?.dataUrl}
                      alt={p.label}
                      style={{
                        filter: `brightness(${100 + p.adjustments.brightness}%) contrast(${100 + p.adjustments.contrast}%) sepia(${Math.max(0, p.adjustments.warmth)}%) ${p.name === "monochrome" ? "grayscale(100%)" : ""}`,
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-[#151515]">{p.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Active Tool Sub-Panel: Crop */}
          {activeTool === "crop" && (
            <div className="p-3 bg-[#F8F8F8] border-t border-[#ECECEC] flex items-center justify-around text-xs font-bold">
              {(["original", "square", "4:5"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setCrop((c) => ({ ...c, aspectRatio: r }))}
                  className={`px-3 py-1 rounded-lg uppercase ${crop.aspectRatio === r ? "bg-[#A6475B] text-white" : "text-[#666666]"}`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}

          {/* Active Tool Sub-Panel: Adjust */}
          {activeTool === "adjust" && (
            <div className="p-3 bg-[#F8F8F8] border-t border-[#ECECEC] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Brightness</span>
                <input
                  type="range"
                  min={-30}
                  max={30}
                  value={adjustments.brightness}
                  onChange={(e) => setAdjustments((a) => ({ ...a, brightness: Number(e.target.value) }))}
                  className="w-48 accent-[#A6475B]"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Warmth</span>
                <input
                  type="range"
                  min={0}
                  max={40}
                  value={adjustments.warmth}
                  onChange={(e) => setAdjustments((a) => ({ ...a, warmth: Number(e.target.value) }))}
                  className="w-48 accent-[#A6475B]"
                />
              </div>
            </div>
          )}

          {/* Active Tool Sub-Panel: Text */}
          {activeTool === "text" && (
            <div className="p-3 bg-[#F8F8F8] border-t border-[#ECECEC] flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type celebration text overlay..."
                value={textOverlay}
                onChange={(e) => setTextOverlay(e.target.value)}
                className="flex-1 px-3 py-2 text-base sm:text-xs border border-[#ECECEC] rounded-xl focus:outline-none"
              />
              <button
                onClick={() => setActiveTool("filter")}
                className="px-3 py-1.5 bg-[#A6475B] text-white text-xs font-bold rounded-xl"
              >
                Apply
              </button>
            </div>
          )}

          {/* Bottom Tool Bar: Filter, Crop, Adjust, Music, Text */}
          <div className="p-3 bg-white dark:bg-black border-t border-[#ECECEC] dark:border-[#262626] flex items-center justify-around text-xs font-semibold text-[#151515] dark:text-[#F5F5F5]">
            <button
              onClick={() => setActiveTool(activeTool === "filter" ? null : "filter")}
              className={`flex flex-col items-center py-1 ${activeTool === "filter" ? "text-[#A6475B] dark:text-[#FB7185]" : "text-[#151515] dark:text-white"}`}
            >
              <span className="text-base mb-0.5">✦</span>
              <span>Filter</span>
            </button>
            <button
              onClick={() => setActiveTool(activeTool === "crop" ? null : "crop")}
              className={`flex flex-col items-center py-1 ${activeTool === "crop" ? "text-[#A6475B] dark:text-[#FB7185]" : "text-[#151515] dark:text-white"}`}
            >
              <span className="text-base mb-0.5">⌗</span>
              <span>Crop</span>
            </button>
            <button
              onClick={() => setActiveTool(activeTool === "adjust" ? null : "adjust")}
              className={`flex flex-col items-center py-1 ${activeTool === "adjust" ? "text-[#A6475B] dark:text-[#FB7185]" : "text-[#151515] dark:text-white"}`}
            >
              <span className="text-base mb-0.5">⚙</span>
              <span>Adjust</span>
            </button>
            <button
              onClick={() => {
                setMusicReturnScreen("edit");
                setCurrentScreen("music");
              }}
              className="flex flex-col items-center py-1 text-[#151515] dark:text-white hover:text-[#A6475B] dark:hover:text-[#FB7185]"
            >
              <span className="text-base mb-0.5">🎵</span>
              <span>Music</span>
            </button>
            <button
              onClick={() => setActiveTool(activeTool === "text" ? null : "text")}
              className={`flex flex-col items-center py-1 ${activeTool === "text" ? "text-[#A6475B] dark:text-[#FB7185]" : "text-[#151515] dark:text-white"}`}
            >
              <span className="text-base mb-0.5">T</span>
              <span>Text</span>
            </button>
          </div>

          {/* Instagram-Style 1-Tap "Your story" Share Bar */}
          {mode === "story" && (
            <div className="p-3 bg-white border-t border-[#ECECEC] flex items-center justify-between pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={handlePublishStory}
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow active:scale-95 transition-all"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#A6475B] to-[#D17B8E] text-white text-[10px] flex items-center justify-center font-bold">
                  {session?.nickname ? session.nickname.slice(0, 1).toUpperCase() : "M"}
                </div>
                <span>Your story</span>
              </button>

              <button
                type="button"
                onClick={handlePublishStory}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-full bg-[#A6475B] hover:bg-[#8e3a4c] text-white text-xs font-bold shadow active:scale-95 transition-all"
              >
                {isSubmitting ? "Sharing..." : "Share story ›"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* SCREEN 07: MUSIC PICKER */}
      {currentScreen === "music" && (
        <MusicPickerScreen
          onBack={() => setCurrentScreen(mode === "story" ? "edit" : musicReturnScreen)}
          initialTrackId={attachedTrack?.trackId}
          onSelectTrack={(track, startSec, durSec) => {
            setAttachedTrack({
              trackId: track.id,
              title: track.title,
              artist: track.artist,
              startSeconds: startSec,
              durationSeconds: durSec,
            });
            setCurrentScreen(mode === "story" ? "edit" : musicReturnScreen);
          }}
        />
      )}

      {/* SCREEN PUBLISH SHEET (Instagram-style New Post Screen) */}
      {currentScreen === "publish" && (
        <div className="flex-1 flex flex-col justify-between h-full bg-white dark:bg-black animate-in fade-in-0 duration-150">
          {/* Top Bar: Back arrow, "New post", "Share" button */}
          <div className="px-4 py-3.5 border-b border-[#ECECEC] dark:border-[#262626] flex items-center justify-between bg-white dark:bg-black sticky top-0 z-10">
            <button
              type="button"
              onClick={() => setCurrentScreen("edit")}
              className="p-1 -ml-1 text-[#151515] dark:text-white active:opacity-60"
              aria-label="Back to edit"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="font-semibold text-base text-[#151515] dark:text-white">
              {mode === "story" ? "New story" : "New post"}
            </h2>
            <button
              type="button"
              onClick={handlePublish}
              disabled={isSubmitting || selectedQueue.length === 0}
              className="text-sm font-bold text-[#A6475B] dark:text-[#FB7185] disabled:opacity-30 hover:opacity-80 active:scale-95 transition-all p-1"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-[#A6475B] dark:border-[#FB7185] border-t-transparent rounded-full animate-spin" />
              ) : (
                "Share"
              )}
            </button>
          </div>

          {/* Main Form Body */}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {errorMsg && (
              <div className="m-4 p-2.5 bg-rose-50 dark:bg-rose-950/40 text-[#A6475B] dark:text-[#FB7185] text-xs rounded-xl font-medium border border-rose-200 dark:border-rose-900/50">
                {errorMsg}
              </div>
            )}

            {/* 1. Instagram Signature Row: Left Thumbnail + Right Borderless Caption */}
            <div className="p-4 flex items-start space-x-3.5 bg-white dark:bg-black">
              {/* Media Thumbnail with Carousel Badge */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-stone-900 border border-[#ECECEC] dark:border-[#262626] flex-shrink-0 shadow-sm">
                {selectedQueue[0]?.isVideo ? (
                  <video
                    src={selectedQueue[0].dataUrl}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={selectedQueue[0]?.dataUrl}
                    alt="Post thumbnail"
                    style={filterStyle}
                    className="w-full h-full object-cover"
                  />
                )}
                {selectedQueue.length > 1 && (
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-mono backdrop-blur-xs flex items-center space-x-0.5">
                    <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="7" y="7" width="14" height="14" rx="2" />
                      <path d="M4 17V5a2 2 0 0 1 2-2h12" />
                    </svg>
                    <span>{selectedQueue.length}</span>
                  </div>
                )}
                {selectedQueue[0]?.isVideo && (
                  <div className="absolute top-1 left-1 px-1 rounded bg-black/60 text-white text-[9px]">
                    ▶
                  </div>
                )}
              </div>

              {/* Borderless Caption Input */}
              <div className="flex-1 min-w-0">
                <textarea
                  rows={3}
                  placeholder="Write a caption or wedding wish... #FarahDaniyal2026"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full p-1 text-sm text-[#151515] dark:text-white placeholder-[#999999] focus:outline-none resize-none bg-transparent leading-relaxed"
                />

                {/* Quick Hashtag Insertion Pills */}
                <div className="flex items-center space-x-1.5 mt-1 overflow-x-auto no-scrollbar py-0.5">
                  {["#FarahDaniyal2026", "#SacredVows", "#WeddingMemoir", "#TheGlasshouse"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (!caption.includes(tag)) {
                          setCaption((prev) => (prev ? `${prev.trim()} ${tag}` : tag));
                        }
                      }}
                      className="px-2 py-0.5 rounded-full bg-[#F8F8F8] dark:bg-[#1A1A1A] border border-[#ECECEC] dark:border-[#262626] text-[11px] text-[#666666] dark:text-[#A0A0A0] font-medium hover:text-[#A6475B] dark:hover:text-[#FB7185] hover:border-[#A6475B]/30 whitespace-nowrap active:scale-95 transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-[#ECECEC] dark:bg-[#262626] w-full" />

            {/* 2. Album Collection (Tag Highlight) */}
            <div className="px-4 py-3.5 bg-white dark:bg-black">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3 text-sm text-[#151515] dark:text-white">
                  <svg className="w-5 h-5 text-[#666666] dark:text-[#888888]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="6" y="6" width="14" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 18V4a2 2 0 012-2h12" />
                  </svg>
                  <span className="font-medium">Album collection</span>
                </div>
                <span className="text-xs text-[#A6475B] dark:text-[#FB7185] font-semibold">
                  {highlights.find((h) => h.id === highlightId)?.title || "Nikah"}
                </span>
              </div>

              {/* 1-Tap Highlight Selector Pills */}
              <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pt-1">
                {highlights.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setHighlightId(h.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      highlightId === h.id
                        ? "bg-[#A6475B] text-white shadow-xs font-semibold"
                        : "bg-[#F8F8F8] dark:bg-[#1A1A1A] border border-[#ECECEC] dark:border-[#262626] text-[#151515] dark:text-[#D1D1D1] hover:bg-stone-100 dark:hover:bg-stone-800"
                    }`}
                  >
                    {h.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[1px] bg-[#ECECEC] dark:bg-[#262626] w-full" />

            {/* 3. Add Music Row */}
            <div className="px-4 py-3.5 flex items-center justify-between bg-white dark:bg-black hover:bg-[#FAFAFA] dark:hover:bg-[#141414] transition-colors">
              <div className="flex items-center space-x-3 text-sm text-[#151515] dark:text-white flex-1 min-w-0">
                <svg className="w-5 h-5 text-[#666666] dark:text-[#888888] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <div className="flex-1 min-w-0">
                  <span className="font-medium block">Add music</span>
                  {attachedTrack && (
                    <span className="text-xs text-[#A6475B] dark:text-[#FB7185] truncate block font-medium">
                      🎵 {attachedTrack.title} ({attachedTrack.durationSeconds}s clip)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {attachedTrack ? (
                  <button
                    type="button"
                    onClick={() => setAttachedTrack(null)}
                    className="text-xs text-[#666666] dark:text-[#A0A0A0] hover:text-[#A6475B] dark:hover:text-[#FB7185] p-1 font-medium"
                  >
                    ✕ Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMusicReturnScreen("publish");
                      setCurrentScreen("music");
                    }}
                    className="flex items-center space-x-1 text-xs text-[#666666] dark:text-[#A0A0A0] hover:text-[#A6475B] dark:hover:text-[#FB7185] font-medium"
                  >
                    <span>Choose</span>
                    <span>›</span>
                  </button>
                )}
              </div>
            </div>

            <div className="h-[1px] bg-[#ECECEC] dark:bg-[#262626] w-full" />

            {/* 4. Add Location Row */}
            <div className="px-4 py-3.5 bg-white dark:bg-black">
              <div className="flex items-center space-x-3 text-sm text-[#151515] dark:text-white mb-2">
                <svg className="w-5 h-5 text-[#666666] dark:text-[#888888] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4.5-5-7.5-8.5-7.5-12a7.5 7.5 0 1115 0c0 3.5-3 7-7.5 12z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                <input
                  type="text"
                  placeholder="Add location..."
                  value={locationTag}
                  onChange={(e) => setLocationTag(e.target.value)}
                  className="w-full text-sm text-[#151515] dark:text-white placeholder-[#999999] focus:outline-none bg-transparent"
                />
              </div>

              {/* Quick Location Chips */}
              <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pt-1">
                {["The Glasshouse at Seputeh", "Kuala Lumpur", "Seputeh"].map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setLocationTag(loc)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      locationTag === loc
                        ? "bg-[#151515] dark:bg-white text-white dark:text-[#151515] shadow-xs"
                        : "bg-[#F8F8F8] dark:bg-[#1A1A1A] border border-[#ECECEC] dark:border-[#262626] text-[#666666] dark:text-[#A0A0A0] hover:text-[#151515] dark:hover:text-white"
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[1px] bg-[#ECECEC] w-full" />

            {/* 5. Audience / Visibility Row */}
            <div className="px-4 py-3.5 flex items-center justify-between bg-white">
              <div className="flex items-center space-x-3 text-sm text-[#151515]">
                <svg className="w-5 h-5 text-[#666666]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                <div>
                  <span className="font-medium block">Audience</span>
                  <span className="text-xs text-[#666666] block">Wedding Guests & Hosts</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#A6475B] flex items-center space-x-1">
                <span>Public to event</span>
                <span>✓</span>
              </span>
            </div>

            <div className="h-[1px] bg-[#ECECEC] w-full" />
          </div>

          {/* Bottom Action Button (Instagram Primary Share) */}
          <div className="p-4 bg-white border-t border-[#ECECEC] pb-[max(1rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={handlePublish}
              disabled={isSubmitting || selectedQueue.length === 0}
              className="w-full py-3.5 bg-[#A6475B] text-white rounded-xl text-sm font-bold shadow hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sharing to wedding feed...</span>
                </>
              ) : (
                <span>Share to wedding album</span>
              )}
            </button>
            <p className="text-[11px] text-[#888888] text-center mt-2">
              Shared to Farah & Daniyal’s live wedding memories
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
