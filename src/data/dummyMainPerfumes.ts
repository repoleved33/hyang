export type Perfume = {
  id: string;
  name: string;
  brand: string;
  image: string;
  liked: boolean;
  inList?: boolean;
  accords: { [key: string]: number };
};

export const dummyMainPerfumes: Perfume[] = [
  {
    id: "1",
    name: "Aqua Universalis",
    brand: "Maison Francis Kurkdjian",
    image: require("@/assets/images/perfumeImg_01.jpg"),
    liked: false,
    accords: { citrus: 4, floral: 2, woody: 1, musk: 0, amber: 0 },
  },
  {
    id: "2",
    name: "Light Blue",
    brand: "Dolce & Gabbana",
    image: require("@/assets/images/perfumeImg_02.jpg"),
    liked: true,
    accords: { citrus: 5, floral: 3, woody: 2, musk: 0, amber: 1 },
  },
  {
    id: "3",
    name: "Le Labo Another 13",
    brand: "Le Labo",
    image: require("@/assets/images/perfumeImg_01.jpg"),
    liked: false,
    accords: { citrus: 0, floral: 1, woody: 3, musk: 5, amber: 4 },
  },
  {
    id: "4",
    name: "Baccarat Rouge 540",
    brand: "Maison Francis Kurkdjian",
    image: require("@/assets/images/perfumeImg_01.jpg"),
    liked: true,
    accords: { citrus: 1, floral: 3, woody: 4, musk: 2, amber: 5 },
  },
  {
    id: "5",
    name: "Santal 33",
    brand: "Le Labo",
    image: require("@/assets/images/perfumeImg_01.jpg"),
    liked: false,
    accords: { citrus: 0, floral: 1, woody: 5, musk: 3, amber: 2 },
  },
  {
    id: "6",
    name: "Flowerbomb",
    brand: "Viktor & Rolf",
    image: require("@/assets/images/perfumeImg_01.jpg"),
    liked: false,
    accords: { citrus: 2, floral: 5, woody: 1, musk: 1, amber: 0 },
  },
  {
    id: "7",
    name: "Good Girl",
    brand: "Carolina Herrera",
    image: require("@/assets/images/perfumeImg_01.jpg"),
    liked: true,
    accords: { citrus: 1, floral: 4, woody: 2, musk: 3, amber: 2 },
  },
  {
    id: "8",
    name: "Daisy",
    brand: "Marc Jacobs",
    image: require("@/assets/images/perfumeImg_01.jpg"),
    liked: false,
    accords: { citrus: 2, floral: 5, woody: 1, musk: 0, amber: 0 },
  },
  {
    id: "9",
    name: "Black Opium",
    brand: "Yves Saint Laurent",
    image: require("@/assets/images/perfumeImg_01.jpg"),
    liked: false,
    accords: { citrus: 0, floral: 2, woody: 2, musk: 4, amber: 3 },
  },
  {
    id: "10",
    name: "Jo Malone Lime Basil",
    brand: "Jo Malone",
    image: require("@/assets/images/perfumeImg_01.jpg"),
    liked: true,
    accords: { citrus: 5, floral: 2, woody: 1, musk: 0, amber: 0 },
  },
];
