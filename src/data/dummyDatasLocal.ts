import { MyPerfume } from "@/src/types/perfume";

export const MyPerfumeList: MyPerfume[] = [
  { userId: "u001", perfId: "p001", isFavourite: true, addedAt: 1675000000 },
  { userId: "u001", perfId: "p003", isFavourite: false, addedAt: 1675086400 },
  { userId: "u002", perfId: "p002", isFavourite: true, addedAt: 1675090000 },
];

export const ScentLog = [
  [
    {
      id: 1,
      userId: "u001",
      date: "2026-01-20",
      perfId: "p001",
      orderIndex: 1,
    },
    {
      id: 2,
      userId: "u001",
      date: "2026-01-20",
      perfId: "p003",
      orderIndex: 2,
    },
    {
      id: 3,
      userId: "u001",
      date: "2026-01-21",
      perfId: "p002",
      orderIndex: 1,
    },
    {
      id: 4,
      userId: "u002",
      date: "2026-01-22",
      perfId: "p002",
      orderIndex: 1,
    },
  ],
];
