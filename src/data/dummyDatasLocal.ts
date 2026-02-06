import { MyPerfume } from "@/src/types/perfume";
import { ScentLog } from "../types/scentLog";

export const MyPerfumeList: MyPerfume[] = [
  { userId: "u001", perfId: "p001", isFavourite: true, addedAt: 1675000000 },
  { userId: "u001", perfId: "p003", isFavourite: false, addedAt: 1675086400 },
  { userId: "u002", perfId: "p002", isFavourite: true, addedAt: 1675090000 },
];

export const ScentLogList: ScentLog[] = [
  {
    idx: 1,
    userId: "u001",
    date: "2026-01-20",
    perfId: "p001",
    orderIdx: 1,
  },
  {
    idx: 2,
    userId: "u001",
    date: "2026-01-20",
    perfId: "p003",
    orderIdx: 2,
  },
  {
    idx: 3,
    userId: "u001",
    date: "2026-01-21",
    perfId: "p002",
    orderIdx: 1,
  },
  {
    idx: 4,
    userId: "u002",
    date: "2026-01-22",
    perfId: "p002",
    orderIdx: 1,
  },
];
