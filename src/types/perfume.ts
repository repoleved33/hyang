export type AccordKey = string;

export type AccordLevel =
  | "Dominant"
  | "Prominent"
  | "Moderate"
  | "Subtle"
  | "Trace";

export type AccordMeta = {
  label: string;
  color: string;
};

export const ACCORD_META: Record<AccordKey, AccordMeta> = {
  woody: { label: "Woody", color: "#8B5A2B" },
  musky: { label: "Musky", color: "#6B7280" },
  amber: { label: "Amber", color: "#F59E0B" },
  floral: { label: "Floral", color: "#EC4899" },
  citrus: { label: "Citrus", color: "#FACC15" },
};

export type PerfumeAccord = {
  accord: AccordKey;
  score: number; // 0~5 or 0~100
};

export type RawMainAccords = Record<AccordKey, AccordLevel>;

export type Perfume = {
  perfId: string;
  name: string;
  brand: string;
  imageUrl: string;
  mainAccords: PerfumeAccord[];
  rawMainAccords: RawMainAccords;
};

export type MyPerfume = {
  userId: string;
  perfId: string; // Perfume.perfId

  isFavourite: boolean;
  addedAt: number; // Date.now()
};

// for screen
export type MyPerfumeWithDetail = {
  perfume: Perfume;
  my: MyPerfume;
};
