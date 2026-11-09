// Post comment interface for wedding memories
export interface PostComment {
  id: string;
  authorNickname: string;
  avatarLetter: string;
  text: string;
  gifUrl?: string;
  createdAt: string;
  liked: boolean;
  likesCount?: number;
}

export const INITIAL_POST_COMMENTS: Record<string, PostComment[]> = {
  post_1: [
    {
      id: "c_1",
      authorNickname: "Aisyah",
      avatarLetter: "A",
      text: "Such a moving solemnisation ceremony. Farah, your veil was heavenly!",
      createdAt: "2026-11-14T11:40:00+08:00",
      liked: true,
    },
    {
      id: "c_2",
      authorNickname: "Zayd",
      avatarLetter: "Z",
      text: "Daniyal stood so firm during the vows! Congratulations brother.",
      createdAt: "2026-11-14T12:05:00+08:00",
      liked: true,
    },
    {
      id: "c_3",
      authorNickname: "Hafiz",
      avatarLetter: "H",
      text: "The floral archway was breathtaking. Wishing you both a lifetime of happiness.",
      createdAt: "2026-11-14T12:20:00+08:00",
      liked: false,
    },
  ],
  post_2: [
    {
      id: "c_4",
      authorNickname: "Farah",
      avatarLetter: "F",
      text: "Thank you Zayd for the hilarious and sweet best man toast!",
      createdAt: "2026-11-14T22:00:00+08:00",
      liked: true,
    },
  ],
  post_3: [
    {
      id: "c_5",
      authorNickname: "Daniyal",
      avatarLetter: "D",
      text: "Thank you Uncle Rashid for the warm welcome. Truly honored.",
      createdAt: "2026-11-14T15:00:00+08:00",
      liked: true,
    },
  ],
  post_4: [
    {
      id: "c_6",
      authorNickname: "Nadia",
      avatarLetter: "N",
      text: "The dining conservatory under fairy lights felt like a fairytale dream!",
      createdAt: "2026-11-14T21:10:00+08:00",
      liked: true,
    },
  ],
};

