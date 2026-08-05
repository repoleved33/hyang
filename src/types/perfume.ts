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
  isDeleted?: boolean;
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
  smoky: { label: "Smoky", color: "#64748B" }, // 추가: 은은한 연기/연한 먹색
  earthy: { label: "Earthy", color: "#5F6F52" },
  patchouli: { label: "Patchouli", color: "#705238" }, // 추가: 깊은 흙/약초 브라운
  mossy: { label: "Mossy", color: "#556B2F" }, // 추가: 이끼색 올리브그린

  // Floral & Sweet
  floral: { label: "Floral", color: "#F2A7B5" },
  rose: { label: "Rose", color: "#E07A7A" },
  white_floral: { label: "White Floral", color: "#E8ECEF" }, // 명도 높여 더 하얗게 조정
  yellow_floral: { label: "Yellow Floral", color: "#FCD34D" }, // 추가: 밝은 일랑일랑/미모사 옐로우
  sweet: { label: "Sweet", color: "#F3C5DA" },
  vanilla: { label: "Vanilla", color: "#F5E6BE" },
  powdery: { label: "Powdery", color: "#E9D5CA" },

  // Fresh, Green & Water
  citrus: { label: "Citrus", color: "#F9D949" },
  green: { label: "Green", color: "#94A684" },
  fresh: { label: "Fresh", color: "#A8DADC" },
  marine: { label: "Marine", color: "#457B9D" },
  aquatic: { label: "Aquatic", color: "#7AD3E8" }, // 추가: 맑은 투명 물빛 Blue
  ozonic: { label: "Ozonic", color: "#BEE3F8" }, // 추가: 시원한 공기/산소 스카이블루
  aromatic: { label: "Aromatic", color: "#A2AD91" },

  // Spicy & Gourmet
  spicy: { label: "Spicy", color: "#BC544B" },
  warm_spicy: { label: "Warm Spicy", color: "#D97706" }, // 추가: 시나몬/스파이스의 따뜻한 오렌지 브라운
  soft_spicy: { label: "Soft Spicy", color: "#E09F67" }, // 추가: 부드러운 스파이시 톤
  fresh_spicy: { label: "Fresh Spicy", color: "#C05621" }, // 추가: 톡 쏘는 프레시 스파이시
  cinnamon: { label: "Cinnamon", color: "#B45309" }, // 추가: 육계나무/계피 브라운
  fruity: { label: "Fruity", color: "#F19066" },
  balsamic: { label: "Balsamic", color: "#9A3B3B" },
};

// // for screen
// export type MyPerfumeWithDetail = {
//   perfume: Perfume;
//   my: MyPerfume;
// };
