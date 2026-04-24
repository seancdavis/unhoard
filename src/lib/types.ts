export type Collection = {
  id: string;
  userId: string;
  name: string;
  emoji: string;
  accent: string;
  createdAt: string;
  updatedAt: string;
  itemCount?: number;
};

export type Item = {
  id: string;
  collectionId: string;
  userId: string;
  name: string;
  notes: string;
  tags: string[];
  imageKey: string | null;
  placeholderSeed: number;
  isWishlist: boolean;
  createdAt: string;
  updatedAt: string;
};

export const ACCENTS = ["tomato", "sun", "sea", "blush", "plum"] as const;
export type Accent = (typeof ACCENTS)[number];

export const ACCENT_HEX: Record<Accent, string> = {
  tomato: "#E25A3C",
  sun: "#F5C14B",
  sea: "#2D8B8B",
  blush: "#F0B8A8",
  plum: "#6B4A74",
};
