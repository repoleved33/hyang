import React, { ReactNode, createContext, useContext, useState } from "react";

import { MyPerfumeList } from "@/src/data/dummyDatasLocal";
import { MyPerfume, Perfume } from "@/src/types/perfume";

type MyPerfumeContextType = {
  myPerfumes: MyPerfume[];
  addMyPerfume: (perfume: Perfume) => void;
  toggleFavourite: (perfId: string) => void;
  toggleHave: (perfId: string) => void;
};

// define
const MyPerfumeContext = createContext<MyPerfumeContextType | undefined>(
  undefined,
);

// storage
export const MyPerfumeProvider = ({ children }: { children: ReactNode }) => {
  const [myPerfumes, setMyPerfumes] = useState<MyPerfume[]>(MyPerfumeList);

  const addMyPerfume = (perfume: Perfume) => {
    const exists = myPerfumes.some((p) => p.perfId === perfume.perfId);
    if (exists) return;

    const newMyPerfume: MyPerfume = {
      userId: "u001", // 나중에 auth 붙이면 교체
      perfId: perfume.perfId,
      isFavourite: false,
      addedAt: Date.now(),
    };

    setMyPerfumes((prev) => [...prev, newMyPerfume]);
  };

  const toggleFavourite = (perfId: string) => {
    setMyPerfumes((prev) =>
      prev.map((p) =>
        p.perfId === perfId ? { ...p, isFavourite: !p.isFavourite } : p,
      ),
    );
  };

  const toggleHave = (perfId: string) => {
    setMyPerfumes((prev) => {
      const exists = prev.some((p) => p.perfId === perfId);
      if (exists) {
        // delete
        return prev.filter((p) => p.perfId !== perfId);
      } else {
        // add
        const newEntry: MyPerfume = {
          userId: "u001",
          perfId: perfId,
          isFavourite: false,
          addedAt: Date.now(),
        };
        return [...prev, newEntry];
      }
    });
  };

  return (
    <MyPerfumeContext.Provider
      value={{ myPerfumes, addMyPerfume, toggleFavourite, toggleHave }}
    >
      {children}
    </MyPerfumeContext.Provider>
  );
};

// Context Consumer Hook
export const useMyPerfume = () => {
  const context = useContext(MyPerfumeContext);
  if (!context) {
    throw new Error("useMyPerfume must be used within MyPerfumeProvider");
  }
  return context;
};
