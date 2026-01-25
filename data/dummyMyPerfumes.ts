export type MyPerfume = {
  id: string;
  name: string;
  brand: string;
  image: string;
  liked: boolean;
  inList?: boolean;
  accords: { [key: string]: number };
};

export const dummyMyPerfumes: MyPerfume[] = [
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
];
