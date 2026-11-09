import React from "react";

// Memoir by FACEZ distinctive script logo mark with Instagram-style neon sunset gradient
export function MemoirWordmark({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col items-start leading-none select-none ${className || ""}`}>
      <span className="font-serif italic font-bold text-[26px] tracking-tight bg-gradient-to-r from-[#D946EF] via-[#F43F5E] to-[#FB923C] bg-clip-text text-transparent drop-shadow-xs">
        Memoir
      </span>
      <span className="text-[8.5px] font-sans uppercase font-bold tracking-[0.25em] text-[#888888] dark:text-[#A0A0A0] mt-0.5">
        by FACEZ
      </span>
    </div>
  );
}

// 5 Main Navigation Icons (Home, Highlights, Add, Wishes, Profile)
export function NavHomeIcon({ active, className }: { active?: boolean; className?: string }) {
  return (
    <svg className={className || `w-6 h-6 ${active ? "text-[#151515]" : "text-[#666666]"}`} fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "0" : "1.8"} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

// Section 21 correction: "Use one consistent stacked-photo icon for Highlights"
export function NavHighlightsIcon({ active, className }: { active?: boolean; className?: string }) {
  return (
    <svg className={className || `w-6 h-6 ${active ? "text-[#151515]" : "text-[#666666]"}`} fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} viewBox="0 0 24 24">
      <rect x="6" y="6" width="14" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 18V4a2 2 0 012-2h12" />
    </svg>
  );
}

// Section 21 correction: "Label the centre navigation action Add rather than Plus"
export function NavAddIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-6 h-6 text-[#151515]"} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m-4-4h8" />
    </svg>
  );
}

export function NavWishesIcon({ active, className }: { active?: boolean; className?: string }) {
  return (
    <svg className={className || `w-6 h-6 ${active ? "text-[#A6475B]" : "text-[#666666]"}`} fill={active ? "#A6475B" : "none"} stroke={active ? "#A6475B" : "currentColor"} strokeWidth={active ? "0" : "1.8"} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

export function NavProfileIcon({ active, className }: { active?: boolean; className?: string }) {
  return (
    <svg className={className || `w-6 h-6 ${active ? "text-[#151515]" : "text-[#666666]"}`} fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

// Post action icons (Dusty rose active heart, comment, share, bookmark)
export function HeartIcon({ filled, className }: { filled?: boolean; className?: string }) {
  if (filled) {
    return (
      <svg className={className || "w-6 h-6 text-[#A6475B] fill-[#A6475B]"} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  }
  return (
    <svg className={className || "w-6 h-6 text-[#151515]"} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

export function CommentIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-6 h-6 text-[#151515]"} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.535 1.11.267 1.666L4.5 21.375l2.766-.822a1.75 1.75 0 011.233.153A9.227 9.227 0 0012 20.25z" />
    </svg>
  );
}

export function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-6 h-6 text-[#151515]"} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  );
}

export function BookmarkIcon({ filled, className }: { filled?: boolean; className?: string }) {
  if (filled) {
    return (
      <svg className={className || "w-6 h-6 text-[#151515] fill-current"} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    );
  }
  return (
    <svg className={className || "w-6 h-6 text-[#151515]"} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
    </svg>
  );
}

export function MusicNoteIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-4 h-4"} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
  );
}

