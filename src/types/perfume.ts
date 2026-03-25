export type Perfume = {
  // perf_id: string; // Supabase
  perfId?: string; // SQLite(Optional)
  name: string;
  brand: string;
  image_url: string;
  main_accords: PerfumeAccord[];
};

export type MyPerfume = {
  userId: string;
  perfId: string; // Perfume.perfId

  isFavourite: boolean;
  addedAt: number; // Date.now()
};

export type MyPerfumeWithDetail = MyPerfume & {
  details?: Perfume;
};

export type PerfumeAccord = {
  accord: AccordKey;
  score: number; // 0~5 or 0~100
};
export type AccordKey = string;

export type AccordMeta = {
  label: string;
  color: string;
};

export const ACCORD_META: Record<AccordKey, AccordMeta> = {
  // Warm & Deep
  woody: { label: "Woody", color: "#A67B5B" },
  musky: { label: "Musky", color: "#D1D5DB" },
  amber: { label: "Amber", color: "#E69B42" },
  animalic: { label: "Animalic", color: "#7D6E63" },
  leather: { label: "Leather", color: "#8B4513" },

  // Floral & Sweet
  floral: { label: "Floral", color: "#F2A7B5" },
  rose: { label: "Rose", color: "#E07A7A" },
  white_floral: { label: "White Floral", color: "#E5E7EB" },
  sweet: { label: "Sweet", color: "#F3C5DA" },
  vanilla: { label: "Vanilla", color: "#F5E6BE" },

  // Fresh & Green
  citrus: { label: "Citrus", color: "#F9D949" },
  green: { label: "Green", color: "#94A684" },
  fresh: { label: "Fresh", color: "#A8DADC" },
  marine: { label: "Marine", color: "#457B9D" },
  aromatic: { label: "Aromatic", color: "#A2AD91" },

  // Spicy & Gourmet
  spicy: { label: "Spicy", color: "#BC544B" },
  fruity: { label: "Fruity", color: "#F19066" },
  powdery: { label: "Powdery", color: "#E9D5CA" },
  earthy: { label: "Earthy", color: "#5F6F52" },
  balsamic: { label: "Balsamic", color: "#9A3B3B" },
};

// // for screen
// export type MyPerfumeWithDetail = {
//   perfume: Perfume;
//   my: MyPerfume;
// };
