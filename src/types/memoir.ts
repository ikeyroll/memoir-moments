export type ThemeId = "ivory" | "sage" | "midnight";

export type HighlightCategoryId = string; // e.g., "nikah", "reception", "family", "friends", or custom

export interface HighlightCategory {
  id: HighlightCategoryId;
  title: string;
  subtitle: string;
  coverPhotoId?: string;
  isDefault?: boolean;
}

export interface PhotoItem {
  id: string;
  dataUrl: string;
  caption?: string;
  aspectRatio?: "1:1" | "4:5" | "16:9";
  createdAt: string;
  filter?: "normal" | "warm" | "vintage" | "bw";
}

export interface PostComment {
  id: string;
  authorName: string;
  authorRelation: string;
  text: string;
  createdAt: string;
}

export interface WeddingPost {
  id: string;
  authorName: string;
  authorRelation: string; // e.g. "Bride's Sister", "Groom's Uni Friend", "Official Photographer"
  authorAvatarColor: string;
  photos: PhotoItem[];
  caption: string;
  highlightId: HighlightCategoryId;
  createdAt: string;
  likes: string[]; // Array of guest nicknames who liked this post
  comments: PostComment[];
  status: "approved" | "pending" | "hidden";
  featuredInStory: boolean;
  locationTag?: string;
  isSample?: boolean;
}

export interface WeddingWish {
  id: string;
  authorName: string;
  authorRelation: string;
  message: string;
  promptUsed?: string;
  paperStyle: "ivory" | "blush" | "sage" | "gold";
  createdAt: string;
  likes: string[];
  status: "approved" | "pending";
  attachedPhotoDataUrl?: string;
  isSample?: boolean;
}

export interface WeddingSettings {
  coupleNames: string;
  partnerOne: string;
  partnerTwo: string;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
  venueAddress: string;
  hashtag: string;
  welcomeNote: string;
  guestPin: string;
  couplePin: string;
  requireModeration: boolean;
  allowGuestDownloads: boolean;
  theme: ThemeId;
}

export interface GuestSession {
  nickname: string;
  relation: string;
  role: "guest" | "couple";
  joinedAt: string;
  viewedStoryIds: string[];
}
