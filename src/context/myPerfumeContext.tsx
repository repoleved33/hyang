import { MyPerfume, dummyMyPerfumes } from "@/src/data/dummyMyPerfumes";
import React, { ReactNode, createContext, useContext, useState } from "react";

type MyPerfumeContextType = {
  myPerfumes: MyPerfume[];
  addMyPerfume: (myPerfume: MyPerfume) => void;
  toggleLiked: (id: string) => void;
};

const MyPerfumeContext = createContext<MyPerfumeContextType | undefined>(
  undefined,
);

export const MyPerfumeProvider = ({ children }: { children: ReactNode }) => {
  const [myPerfumes, setMyPerfumes] = useState<MyPerfume[]>(
    dummyMyPerfumes.map((p) => ({ ...p, inList: true })),
  );

  const addMyPerfume = (myPerfume: MyPerfume) => {
    if (!myPerfumes.find((p) => p.id === myPerfume.id)) {
      setMyPerfumes([
        ...myPerfumes,
        { ...myPerfume, inList: true, liked: false },
      ]);
    }
  };

  const toggleLiked = (id: string) => {
    setMyPerfumes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, liked: !p.liked } : p)),
    );
  };

  return (
    <MyPerfumeContext.Provider
      value={{ myPerfumes, addMyPerfume, toggleLiked }}
    >
      {children}
    </MyPerfumeContext.Provider>
  );
};

export const useMyPerfume = () => {
  const context = useContext(MyPerfumeContext);
  if (!context)
    throw new Error("useMyPerfume must be used within MyPerfumeProvider");
  return context;
};
