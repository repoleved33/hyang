import { Perfume } from "@/src/types/perfume";

export const User = [
  { userId: "u001", userName: "TestUser" },
  { userId: "u002", userName: "AnotherUser" },
];

export const MainPerfumeList: Perfume[] = [
  {
    perfId: "p001",
    name: "Le Labo Another 13",
    brand: "Le Labo",
    imageUrl: require("@/assets/images/perfumeImg_01.jpg"),
    mainAccords: [
      { accord: "woody", score: 5 },
      { accord: "musky", score: 3 },
      { accord: "amber", score: 2 },
    ],
    rawMainAccords: {
      woody: "Dominant",
      musky: "Moderate",
      amber: "Subtle",
    },
  },

  {
    perfId: "p002",
    name: "Chanel No.5",
    brand: "Chanel",
    imageUrl: require("@/assets/images/perfumeImg_02.jpg"),
    mainAccords: [
      { accord: "floral", score: 5 },
      { accord: "aldehydic", score: 4 },
      { accord: "woody", score: 3 },
    ],
    rawMainAccords: {
      floral: "Dominant",
      aldehydic: "Prominent",
      woody: "Moderate",
    },
  },

  {
    perfId: "p003",
    name: "Dior Sauvage",
    brand: "Dior",
    imageUrl: "https://example.com/images/sauvage.jpg",
    mainAccords: [
      { accord: "citrus", score: 4 },
      { accord: "spicy", score: 4 },
      { accord: "woody", score: 3 },
    ],
    rawMainAccords: {
      citrus: "Prominent",
      spicy: "Prominent",
      woody: "Moderate",
    },
  },

  {
    perfId: "p004",
    name: "Jo Malone Wood Sage & Sea Salt",
    brand: "Jo Malone",
    imageUrl: "https://example.com/images/woodsage_seasalt.jpg",
    mainAccords: [
      { accord: "fresh", score: 4 },
      { accord: "woody", score: 3 },
      { accord: "aquatic", score: 3 },
    ],
    rawMainAccords: {
      fresh: "Prominent",
      woody: "Moderate",
      aquatic: "Moderate",
    },
  },

  {
    perfId: "p005",
    name: "Yves Saint Laurent Black Opium",
    brand: "YSL",
    imageUrl: "https://example.com/images/black_opium.jpg",
    mainAccords: [
      { accord: "vanilla", score: 5 },
      { accord: "coffee", score: 4 },
      { accord: "floral", score: 3 },
    ],
    rawMainAccords: {
      vanilla: "Dominant",
      coffee: "Prominent",
      floral: "Moderate",
    },
  },
];
