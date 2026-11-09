export type ThemePreset = "ivory" | "sage" | "midnight";

export interface HighlightCategory {
  id: string;
  title: string;
  subtitle: string;
  coverMediaId: string;
  isPermanent: boolean;
  order?: number;
}

export interface AttachedTrackInfo {
  trackId: string;
  title: string;
  artist: string;
  startSeconds: number;
  durationSeconds: number; // 5, 10, or 15
  audioUrl?: string;
}

export interface CropSettings {
  aspectRatio: "original" | "square" | "4:5";
  zoom: number;
  offsetX: number;
  offsetY: number;
}

export interface FilterAdjustments {
  brightness: number; // -30 to 30
  contrast: number; // -30 to 30
  warmth: number; // 0 to 40
}

export interface MediaItem {
  id: string;
  dataUrl: string;
  mimeType: string;
  isVideo?: boolean;
}

export interface FeedPost {
  id: string;
  authorNickname: string;
  authorRole: string;
  highlightId: string;
  mediaItems: MediaItem[];
  mediaIds: string[]; // For backwards-compatibility
  caption: string;
  createdAt: string;
  likedByNicknames: string[];
  status: "approved" | "pending";
  locationTag?: string;
  attachedTrack?: AttachedTrackInfo;
  cropSettings?: CropSettings;
  filterAdjustments?: FilterAdjustments;
  textOverlay?: string;
}

export interface GuestStory {
  id: string;
  authorNickname: string;
  authorRole: string;
  mediaItem: MediaItem;
  mediaId: string;
  caption?: string;
  createdAt: string;
  attachedTrack?: AttachedTrackInfo;
  seenByNicknames: string[];
  highlightId?: string;
}

export interface WeddingWish {
  id: string;
  authorNickname: string;
  relationship: string;
  message: string;
  highlightTag: string;
  createdAt: string;
  likedByNicknames: string[];
}

export interface WeddingDetails {
  coupleNames: string;
  partnerOne: string;
  partnerTwo: string;
  brideName?: string;
  groomName?: string;
  weddingDate: string;
  venueName: string;
  city: string;
  welcomeNote: string;
  invitationHeadline?: string;
  invitationWelcomeNote?: string;
  guestPin: string;
  couplePin: string;
  requirePostApproval: boolean;
  allowGuestDownloads: boolean;
  enableEventMusic: boolean;
  theme: ThemePreset;
  coverPhotoUrl: string;
}

export interface GuestSession {
  nickname: string;
  role: "guest" | "host";
  enteredPin: string;
  joinedAt: string;
  savedPostIds: string[];
  seenHighlightIds: string[];
  bio?: string;
  avatarUrl?: string;
}

export interface ActivityNotification {
  id: string;
  type: "like" | "approval" | "comment" | "story";
  actorNickname: string;
  actorAvatarLetter: string;
  message: string;
  targetPostId?: string;
  thumbnailUrl?: string;
  createdAt: string;
  read: boolean;
  group: "today" | "earlier";
}
