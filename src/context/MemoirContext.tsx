"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from "react";
import {
  WeddingDetails,
  HighlightCategory,
  FeedPost,
  WeddingWish,
  GuestSession,
  GuestStory,
  ActivityNotification,
  AttachedTrackInfo,
  CropSettings,
  FilterAdjustments,
  MediaItem,
} from "@/lib/types";
import {
  INITIAL_WEDDING_DETAILS,
  INITIAL_HIGHLIGHTS,
  INITIAL_POSTS,
  INITIAL_WISHES,
  INITIAL_STORIES,
  INITIAL_ACTIVITIES,
  INITIAL_MEDIA_LIST,
} from "@/lib/sampleData";
import {
  getMediaItem,
  saveMediaItem,
  getAllMediaItems,
  clearAllMedia,
  StoredMedia,
} from "@/lib/indexeddb";
import { getBundledWeddingTracks, DemoTrack } from "@/lib/audioService";

interface MemoirContextType {
  weddingDetails: WeddingDetails;
  highlights: HighlightCategory[];
  posts: FeedPost[];
  wishes: WeddingWish[];
  stories: GuestStory[];
  activities: ActivityNotification[];
  session: GuestSession | null;
  isLoading: boolean;
  activeStoryId: string | null;
  setActiveStoryId: (id: string | null) => void;
  activeStoryHighlightId: string | null;
  setActiveStoryHighlightId: (id: string | null) => void;

  // Navigation & Modals
  currentNavTab: "feed" | "highlights" | "add" | "wishes" | "profile";
  setCurrentNavTab: (tab: "feed" | "highlights" | "add" | "wishes" | "profile") => void;
  isActivityOpen: boolean;
  setIsActivityOpen: (open: boolean) => void;
  isHostStudioOpen: boolean;
  setIsHostStudioOpen: (open: boolean) => void;
  isWeddingSettingsOpen: boolean;
  setIsWeddingSettingsOpen: (open: boolean) => void;
  isWeddingInfoSheetOpen: boolean;
  setIsWeddingInfoSheetOpen: (open: boolean) => void;
  isWelcomeSplashOpen: boolean;
  setIsWelcomeSplashOpen: (open: boolean) => void;
  isCreateMemoryOpen: boolean;
  setIsCreateMemoryOpen: (open: boolean) => void;
  createMemoryInitialMode: "post" | "story";
  openCreateMemory: (mode?: "post" | "story") => void;

  // Appearance & Theme (Light / Dark Mode)
  theme: "light" | "dark";
  toggleTheme: () => void;

  // Feed Search & Highlight Filter
  feedSearchQuery: string;
  setFeedSearchQuery: (q: string) => void;
  feedHighlightFilter: string;
  setFeedHighlightFilter: (id: string) => void;

  // Session & Demo Role Actions
  loginGuest: (nickname: string, pin: string) => { success: boolean; error?: string };
  switchDemoRole: (role: "guest" | "host") => void;
  logout: () => void;
  updateProfile: (nickname: string, bio?: string) => void;

  // Feed Actions
  toggleLikePost: (postId: string) => void;
  toggleSavePost: (postId: string) => void;
  createPost: (params: {
    mediaFiles: { dataUrl: string; mimeType: string; sizeBytes: number }[];
    caption: string;
    highlightId: string;
    locationTag?: string;
    attachedTrack?: AttachedTrackInfo;
    cropSettings?: CropSettings;
    filterAdjustments?: FilterAdjustments;
    textOverlay?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  approvePost: (postId: string) => void;
  rejectPost: (postId: string) => void;
  deletePost: (postId: string) => void;

  // Stories
  createStory: (params: {
    mediaDataUrl: string;
    mimeType?: string;
    isVideo?: boolean;
    caption?: string;
    attachedTrack?: AttachedTrackInfo;
    highlightId?: string;
  }) => Promise<{ success: boolean }>;
  markStorySeen: (storyId: string) => void;

  // Wishes
  createWish: (message: string, relationship?: string, highlightTag?: string) => { success: boolean; error?: string };
  deleteWish: (wishId: string) => void;
  toggleLikeWish: (wishId: string) => void;

  // Activity
  markAllActivitiesRead: () => void;

  // Highlights management
  createHighlight: (title: string, subtitle: string, coverMediaId: string) => void;
  deleteHighlight: (highlightId: string) => void;
  updateWeddingDetails: (updates: Partial<WeddingDetails>) => void;

  // Audio System
  audioTracks: DemoTrack[];
  currentAudioSource: { trackId: string; title: string; isPlaying: boolean; audioUrl?: string } | null;
  playAudio: (trackId: string, startSec?: number, durationSec?: number, forceUnmute?: boolean) => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  stopAudio: () => void;
  toggleAudioMute: () => void;
  isMuted: boolean;

  // Media & Reset
  getMediaDataUrl: (mediaId: string) => string | undefined;
  resetDemoData: () => Promise<void>;
}

const MemoirContext = createContext<MemoirContextType | undefined>(undefined);

const STORAGE_KEYS = {
  DETAILS: "memoir_wedding_details_v2",
  HIGHLIGHTS: "memoir_highlights_v2",
  POSTS: "memoir_posts_v2",
  WISHES: "memoir_wishes_v2",
  STORIES: "memoir_stories_v2",
  ACTIVITIES: "memoir_activities_v2",
  SESSION: "memoir_session_v2",
};

function safeSetStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore QuotaExceededError when storing large base64 dataUrls; IndexedDB already persists full media
  }
}

export const MemoirProvider = ({ children }: { children: ReactNode }) => {
  const [weddingDetails, setWeddingDetails] = useState<WeddingDetails>(INITIAL_WEDDING_DETAILS);
  const [highlights, setHighlights] = useState<HighlightCategory[]>(INITIAL_HIGHLIGHTS);
  const [posts, setPosts] = useState<FeedPost[]>(INITIAL_POSTS);
  const [wishes, setWishes] = useState<WeddingWish[]>(INITIAL_WISHES);
  const [stories, setStories] = useState<GuestStory[]>(INITIAL_STORIES);
  const [activities, setActivities] = useState<ActivityNotification[]>(INITIAL_ACTIVITIES);
  const [session, setSession] = useState<GuestSession | null>(null);
  const [mediaCache, setMediaCache] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Feed Search & Highlight Filter
  const [feedSearchQuery, setFeedSearchQuery] = useState("");
  const [feedHighlightFilter, setFeedHighlightFilter] = useState("all");

  // App Navigation
  const [currentNavTab, setCurrentNavTab] = useState<"feed" | "highlights" | "add" | "wishes" | "profile">("feed");
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [isHostStudioOpen, setIsHostStudioOpen] = useState(false);
  const [isWeddingSettingsOpen, setIsWeddingSettingsOpen] = useState(false);
  const [isWeddingInfoSheetOpen, setIsWeddingInfoSheetOpen] = useState(false);
  const [isWelcomeSplashOpen, setIsWelcomeSplashOpen] = useState(true);
  const [isCreateMemoryOpen, setIsCreateMemoryOpen] = useState(false);
  const [createMemoryInitialMode, setCreateMemoryInitialMode] = useState<"post" | "story">("post");

  // Theme State (Light vs Dark mode)
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("memoir_theme_v2");
    if (saved === "dark" || saved === "light") {
      setTheme(saved);
      if (saved === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    } else if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("memoir_theme_v2", next);
      if (next === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  }, []);

  const openCreateMemory = useCallback((mode: "post" | "story" = "post") => {
    setCreateMemoryInitialMode(mode);
    setIsCreateMemoryOpen(true);
  }, []);

  // Story Viewer
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [activeStoryHighlightId, setActiveStoryHighlightId] = useState<string | null>(null);

  // Audio system state
  const [audioTracks, setAudioTracks] = useState<DemoTrack[]>([]);
  const [currentAudioSource, setCurrentAudioSource] = useState<{ trackId: string; title: string; isPlaying: boolean; audioUrl?: string } | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const globalAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize storage
  useEffect(() => {
    async function init() {
      try {
        // Load Audio Tracks
        const tracks = getBundledWeddingTracks();
        setAudioTracks(tracks);

        // Load details
        const savedDetails = localStorage.getItem(STORAGE_KEYS.DETAILS);
        if (savedDetails) {
          try { setWeddingDetails(JSON.parse(savedDetails)); } catch { /* ignore */ }
        }

        // Load highlights
        const savedHighlights = localStorage.getItem(STORAGE_KEYS.HIGHLIGHTS);
        if (savedHighlights) {
          try { setHighlights(JSON.parse(savedHighlights)); } catch { /* ignore */ }
        }

        // Load posts
        const savedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
        if (savedPosts) {
          try { setPosts(JSON.parse(savedPosts)); } catch { /* ignore */ }
        }

        // Load wishes
        const savedWishes = localStorage.getItem(STORAGE_KEYS.WISHES);
        if (savedWishes) {
          try { setWishes(JSON.parse(savedWishes)); } catch { /* ignore */ }
        }

        // Load stories
        const savedStories = localStorage.getItem(STORAGE_KEYS.STORIES);
        if (savedStories) {
          try { setStories(JSON.parse(savedStories)); } catch { /* ignore */ }
        }

        // Load activities
        const savedActs = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
        if (savedActs) {
          try { setActivities(JSON.parse(savedActs)); } catch { /* ignore */ }
        }

        // Load session
        const savedSession = localStorage.getItem(STORAGE_KEYS.SESSION);
        if (savedSession) {
          try { setSession(JSON.parse(savedSession)); } catch { /* ignore */ }
        } else {
          // Default demo participant
          const defaultSession: GuestSession = {
            nickname: "Aisyah",
            role: "guest",
            enteredPin: "2026",
            joinedAt: new Date().toISOString(),
            savedPostIds: ["post_1"],
            seenHighlightIds: [],
            bio: "Bridesmaid & longtime friend of Farah 🌸",
          };
          setSession(defaultSession);
          localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(defaultSession));
        }

        // Seed IndexedDB media
        const existingMedia = await getAllMediaItems();
        if (existingMedia.length === 0) {
          for (const item of INITIAL_MEDIA_LIST) {
            await saveMediaItem(item);
          }
          const cache: Record<string, string> = {};
          INITIAL_MEDIA_LIST.forEach((m) => { cache[m.id] = m.dataUrl; });
          setMediaCache(cache);
        } else {
          const cache: Record<string, string> = {};
          existingMedia.forEach((m) => { cache[m.id] = m.dataUrl; });
          setMediaCache(cache);
        }
      } catch (err) {
        console.error("Storage init error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, []);

  // Audio Playback Controller
  const playAudio = useCallback((trackId: string, startSec = 0, durationSec = 15, forceUnmute = false) => {
    if (typeof window === "undefined") return;

    const track = audioTracks.find((t) => t.id === trackId) || audioTracks[0];
    if (!track || !track.audioDataUrl) return;

    if (!globalAudioRef.current) {
      globalAudioRef.current = new Audio();
    }

    const audio = globalAudioRef.current;

    if (forceUnmute) {
      setIsMuted(false);
      audio.muted = false;
    } else {
      audio.muted = isMuted;
    }

    // If changing track, set new src and reset time
    if (audio.src !== track.audioDataUrl) {
      audio.src = track.audioDataUrl;
      audio.currentTime = startSec;
    }
    audio.loop = true;

    audio.play().then(() => {
      setCurrentAudioSource({
        trackId: track.id,
        title: track.title,
        isPlaying: true,
        audioUrl: track.audioDataUrl,
      });
    }).catch(() => {
      // Browser blocked autoplay due to gesture policy: play muted then notify
      audio.muted = true;
      audio.play().then(() => {
        setCurrentAudioSource({
          trackId: track.id,
          title: track.title,
          isPlaying: true,
          audioUrl: track.audioDataUrl,
        });
      }).catch(() => {
        setCurrentAudioSource({
          trackId: track.id,
          title: track.title,
          isPlaying: false,
          audioUrl: track.audioDataUrl,
        });
      });
    });
  }, [audioTracks, isMuted]);

  const pauseAudio = useCallback(() => {
    if (globalAudioRef.current && !globalAudioRef.current.paused) {
      globalAudioRef.current.pause();
      setCurrentAudioSource((prev) => (prev ? { ...prev, isPlaying: false } : null));
    }
  }, []);

  const resumeAudio = useCallback(() => {
    if (globalAudioRef.current && globalAudioRef.current.paused) {
      globalAudioRef.current.play().then(() => {
        setCurrentAudioSource((prev) => (prev ? { ...prev, isPlaying: true } : null));
      }).catch(() => {});
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (globalAudioRef.current) {
      globalAudioRef.current.pause();
      globalAudioRef.current.currentTime = 0;
    }
    setCurrentAudioSource((prev) => (prev ? { ...prev, isPlaying: false } : null));
  }, []);

  const toggleAudioMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (globalAudioRef.current) {
        globalAudioRef.current.muted = next;
        if (!next && globalAudioRef.current.paused) {
          globalAudioRef.current.play().catch(() => {});
          setCurrentAudioSource((s) => (s ? { ...s, isPlaying: true } : null));
        }
      }
      return next;
    });
  }, []);

  // Login as guest
  const loginGuest = useCallback((nickname: string, pin: string) => {
    const trimmed = nickname.trim();
    if (!trimmed) return { success: false, error: "Please enter your nickname." };
    if (weddingDetails.guestPin && pin.trim() !== weddingDetails.guestPin) {
      return { success: false, error: "Invalid demo PIN. Try 2026." };
    }

    const newSession: GuestSession = {
      nickname: trimmed,
      role: "guest",
      enteredPin: pin.trim(),
      joinedAt: new Date().toISOString(),
      savedPostIds: [],
      seenHighlightIds: [],
    };
    setSession(newSession);
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(newSession));
    return { success: true };
  }, [weddingDetails.guestPin]);

  // Demo role switch (Guest vs Host)
  const switchDemoRole = useCallback((role: "guest" | "host") => {
    setSession((prev) => {
      if (!prev) return null;
      const updated: GuestSession = { ...prev, role };
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }, []);

  const updateProfile = useCallback((nickname: string, bio?: string) => {
    setSession((prev) => {
      if (!prev) return null;
      const updated: GuestSession = { ...prev, nickname: nickname.trim(), bio: bio?.trim() };
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Feed Post Actions
  const toggleLikePost = useCallback((postId: string) => {
    if (!session) return;
    setPosts((prev) => {
      const next = prev.map((post) => {
        if (post.id !== postId) return post;
        const liked = post.likedByNicknames.includes(session.nickname);
        const newLikes = liked
          ? post.likedByNicknames.filter((n) => n !== session.nickname)
          : [...post.likedByNicknames, session.nickname];
        return { ...post, likedByNicknames: newLikes };
      });
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(next));
      return next;
    });
  }, [session]);

  const toggleSavePost = useCallback((postId: string) => {
    if (!session) return;
    const isSaved = session.savedPostIds.includes(postId);
    const nextSaved = isSaved
      ? session.savedPostIds.filter((id) => id !== postId)
      : [...session.savedPostIds, postId];

    const updated: GuestSession = { ...session, savedPostIds: nextSaved };
    setSession(updated);
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(updated));
  }, [session]);

  // Create post
  const createPost = useCallback(async (params: {
    mediaFiles: { dataUrl: string; mimeType: string; sizeBytes: number }[];
    caption: string;
    highlightId: string;
    locationTag?: string;
    attachedTrack?: AttachedTrackInfo;
    cropSettings?: CropSettings;
    filterAdjustments?: FilterAdjustments;
    textOverlay?: string;
  }) => {
    if (!session) return { success: false, error: "Please enter your nickname first." };
    if (params.mediaFiles.length === 0) return { success: false, error: "No photo selected." };

    const mediaIds: string[] = [];
    const nowIso = new Date().toISOString();

    try {
      for (let i = 0; i < params.mediaFiles.length; i++) {
        const file = params.mediaFiles[i];
        const mediaId = `media_user_${Date.now()}_${i}`;
        const storedItem: StoredMedia = {
          id: mediaId,
          dataUrl: file.dataUrl,
          mimeType: file.mimeType,
          sizeBytes: file.sizeBytes,
          uploadedAt: nowIso,
        };
        await saveMediaItem(storedItem);
        mediaIds.push(mediaId);
        setMediaCache((prev) => ({ ...prev, [mediaId]: file.dataUrl }));
      }

      const isPending = weddingDetails.requirePostApproval && session.role !== "host";

      const mediaItems: MediaItem[] = params.mediaFiles.map((file, idx) => ({
        id: mediaIds[idx],
        dataUrl: file.dataUrl,
        mimeType: file.mimeType,
        isVideo: file.mimeType.startsWith("video/"),
      }));

      const newPost: FeedPost = {
        id: `post_${Date.now()}`,
        authorNickname: session.nickname,
        authorRole: session.role === "host" ? "Host" : "Guest",
        highlightId: params.highlightId,
        mediaItems,
        mediaIds,
        caption: params.caption.trim(),
        createdAt: nowIso,
        likedByNicknames: [],
        status: isPending ? "pending" : "approved",
        locationTag: params.locationTag?.trim() || undefined,
        attachedTrack: params.attachedTrack,
        cropSettings: params.cropSettings,
        filterAdjustments: params.filterAdjustments,
        textOverlay: params.textOverlay,
      };

      setPosts((prev) => {
        const next = [newPost, ...prev];
        safeSetStorage(STORAGE_KEYS.POSTS, next);
        return next;
      });

      return { success: true };
    } catch (err) {
      console.error("Create post error:", err);
      return { success: false, error: "IndexedDB error saving image files." };
    }
  }, [session, weddingDetails.requirePostApproval]);

  const approvePost = useCallback((postId: string) => {
    setPosts((prev) => {
      const next = prev.map((p) => (p.id === postId ? { ...p, status: "approved" as const } : p));
      safeSetStorage(STORAGE_KEYS.POSTS, next);
      return next;
    });
  }, []);

  const rejectPost = useCallback((postId: string) => {
    setPosts((prev) => {
      const next = prev.filter((p) => p.id !== postId);
      safeSetStorage(STORAGE_KEYS.POSTS, next);
      return next;
    });
  }, []);

  const deletePost = useCallback((postId: string) => {
    setPosts((prev) => {
      const next = prev.filter((p) => p.id !== postId);
      safeSetStorage(STORAGE_KEYS.POSTS, next);
      return next;
    });
  }, []);

  // Stories
  const createStory = useCallback(async (params: {
    mediaDataUrl: string;
    mimeType?: string;
    isVideo?: boolean;
    caption?: string;
    attachedTrack?: AttachedTrackInfo;
    highlightId?: string;
  }) => {
    if (!session) return { success: false };
    const mediaId = `media_story_${Date.now()}`;
    const nowIso = new Date().toISOString();
    const resolvedMime = params.mimeType || (params.mediaDataUrl.startsWith("data:video/") ? "video/mp4" : "image/jpeg");
    const resolvedIsVideo = params.isVideo ?? resolvedMime.startsWith("video/");

    await saveMediaItem({
      id: mediaId,
      dataUrl: params.mediaDataUrl,
      mimeType: resolvedMime,
      sizeBytes: 150000,
      uploadedAt: nowIso,
    });
    setMediaCache((prev) => ({ ...prev, [mediaId]: params.mediaDataUrl }));

    const newStory: GuestStory = {
      id: `story_${Date.now()}`,
      authorNickname: session.nickname,
      authorRole: session.role === "host" ? "Host" : "Guest",
      mediaItem: {
        id: mediaId,
        dataUrl: params.mediaDataUrl,
        mimeType: resolvedMime,
        isVideo: resolvedIsVideo,
      },
      mediaId,
      caption: params.caption,
      createdAt: nowIso,
      attachedTrack: params.attachedTrack,
      seenByNicknames: [],
      highlightId: params.highlightId || "hl_nikah",
    };

    setStories((prev) => {
      const next = [newStory, ...prev];
      safeSetStorage(STORAGE_KEYS.STORIES, next);
      return next;
    });

    return { success: true };
  }, [session]);

  const markStorySeen = useCallback((storyId: string) => {
    if (!session) return;
    setStories((prev) => {
      const target = prev.find((s) => s.id === storyId);
      if (!target || target.seenByNicknames.includes(session.nickname)) {
        return prev;
      }
      const next = prev.map((s) => {
        if (s.id !== storyId) return s;
        return { ...s, seenByNicknames: [...s.seenByNicknames, session.nickname] };
      });
      safeSetStorage(STORAGE_KEYS.STORIES, next);
      return next;
    });
  }, [session]);

  // Wishes
  const createWish = useCallback((message: string, relationship = "Guest", highlightTag = "General") => {
    if (!session) return { success: false, error: "Please enter your name first." };
    if (!message.trim()) return { success: false, error: "Message cannot be empty." };

    const newWish: WeddingWish = {
      id: `wish_${Date.now()}`,
      authorNickname: session.nickname,
      relationship,
      message: message.trim(),
      highlightTag,
      createdAt: new Date().toISOString(),
      likedByNicknames: [],
    };

    setWishes((prev) => {
      const next = [newWish, ...prev];
      localStorage.setItem(STORAGE_KEYS.WISHES, JSON.stringify(next));
      return next;
    });

    return { success: true };
  }, [session]);

  const deleteWish = useCallback((wishId: string) => {
    setWishes((prev) => {
      const next = prev.filter((w) => w.id !== wishId);
      localStorage.setItem(STORAGE_KEYS.WISHES, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleLikeWish = useCallback((wishId: string) => {
    if (!session) return;
    setWishes((prev) => {
      const next = prev.map((w) => {
        if (w.id !== wishId) return w;
        const liked = w.likedByNicknames.includes(session.nickname);
        const newLikes = liked
          ? w.likedByNicknames.filter((n) => n !== session.nickname)
          : [...w.likedByNicknames, session.nickname];
        return { ...w, likedByNicknames: newLikes };
      });
      localStorage.setItem(STORAGE_KEYS.WISHES, JSON.stringify(next));
      return next;
    });
  }, [session]);

  // Activity
  const markAllActivitiesRead = useCallback(() => {
    setActivities((prev) => {
      const next = prev.map((a) => ({ ...a, read: true }));
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(next));
      return next;
    });
  }, []);

  // Highlights
  const createHighlight = useCallback((title: string, subtitle: string, coverMediaId: string) => {
    const newHl: HighlightCategory = {
      id: `hl_${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim(),
      coverMediaId,
      isPermanent: false,
    };
    setHighlights((prev) => {
      const next = [...prev, newHl];
      localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteHighlight = useCallback((highlightId: string) => {
    setHighlights((prev) => {
      const next = prev.filter((h) => h.id !== highlightId || h.isPermanent);
      localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateWeddingDetails = useCallback((updates: Partial<WeddingDetails>) => {
    setWeddingDetails((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEYS.DETAILS, JSON.stringify(next));
      return next;
    });
  }, []);

  const getMediaDataUrl = useCallback((mediaId: string): string | undefined => {
    if (mediaCache[mediaId]) return mediaCache[mediaId];
    getMediaItem(mediaId).then((item) => {
      if (item) {
        setMediaCache((prev) => ({ ...prev, [mediaId]: item.dataUrl }));
      }
    });
    return undefined;
  }, [mediaCache]);

  const resetDemoData = useCallback(async () => {
    setIsLoading(true);
    try {
      localStorage.clear();
      await clearAllMedia();

      for (const item of INITIAL_MEDIA_LIST) {
        await saveMediaItem(item);
      }

      setWeddingDetails(INITIAL_WEDDING_DETAILS);
      setHighlights(INITIAL_HIGHLIGHTS);
      setPosts(INITIAL_POSTS);
      setWishes(INITIAL_WISHES);
      setStories(INITIAL_STORIES);
      setActivities(INITIAL_ACTIVITIES);

      const defaultSession: GuestSession = {
        nickname: "Aisyah",
        role: "guest",
        enteredPin: "2026",
        joinedAt: new Date().toISOString(),
        savedPostIds: ["post_1"],
        seenHighlightIds: [],
        bio: "Bridesmaid & longtime friend of Farah 🌸",
      };
      setSession(defaultSession);
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(defaultSession));

      const cache: Record<string, string> = {};
      INITIAL_MEDIA_LIST.forEach((m) => { cache[m.id] = m.dataUrl; });
      setMediaCache(cache);

      setIsHostStudioOpen(false);
      setIsWeddingSettingsOpen(false);
      setIsCreateMemoryOpen(false);
      setActiveStoryId(null);
      setActiveStoryHighlightId(null);
    } catch (err) {
      console.error("Reset error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <MemoirContext.Provider
      value={{
        weddingDetails,
        highlights,
        posts,
        wishes,
        stories,
        activities,
        session,
        isLoading,
        activeStoryId,
        setActiveStoryId,
        activeStoryHighlightId,
        setActiveStoryHighlightId,
        currentNavTab,
        setCurrentNavTab,
        isActivityOpen,
        setIsActivityOpen,
        isHostStudioOpen,
        setIsHostStudioOpen,
        isWeddingSettingsOpen,
        setIsWeddingSettingsOpen,
        isWeddingInfoSheetOpen,
        setIsWeddingInfoSheetOpen,
        isWelcomeSplashOpen,
        setIsWelcomeSplashOpen,
        isCreateMemoryOpen,
        setIsCreateMemoryOpen,
        createMemoryInitialMode,
        openCreateMemory,
        theme,
        toggleTheme,
        feedSearchQuery,
        setFeedSearchQuery,
        feedHighlightFilter,
        setFeedHighlightFilter,
        loginGuest,
        switchDemoRole,
        logout,
        updateProfile,
        toggleLikePost,
        toggleSavePost,
        createPost,
        approvePost,
        rejectPost,
        deletePost,
        createStory,
        markStorySeen,
        createWish,
        deleteWish,
        toggleLikeWish,
        markAllActivitiesRead,
        createHighlight,
        deleteHighlight,
        updateWeddingDetails,
        audioTracks,
        currentAudioSource,
        playAudio,
        pauseAudio,
        resumeAudio,
        stopAudio,
        toggleAudioMute,
        isMuted,
        getMediaDataUrl,
        resetDemoData,
      }}
    >
      {children}
    </MemoirContext.Provider>
  );
};

export function useMemoir() {
  const context = useContext(MemoirContext);
  if (!context) throw new Error("useMemoir must be used within MemoirProvider");
  return context;
}
