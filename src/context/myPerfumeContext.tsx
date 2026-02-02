// import { MyPerfume, dummyMyPerfumes } from "@/src/data/dummyMyPerfumes";

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

// import React, { ReactNode, createContext, useContext, useState } from "react";
// import { MyPerfumeList } from "@/src/data/dummyDatasLocal";
// import { MyPerfume, Perfume } from "@/src/types/perfume";

// type MyPerfumeContextType = {
//   myPerfumes: MyPerfume[];
//   addMyPerfume: (perfume: Perfume) => void;
//   toggleFavourite: (perfId: string) => void;
//   toggleHave: (perfId: string) => void; // 이 함수가 추가/삭제를 모두 담당합니다.
// };

// const MyPerfumeContext = createContext<MyPerfumeContextType | undefined>(undefined);

// export const MyPerfumeProvider = ({ children }: { children: ReactNode }) => {
//   // 초기 더미 데이터를 상태로 관리합니다.
//   const [myPerfumes, setMyPerfumes] = useState<MyPerfume[]>(MyPerfumeList);

//   // 1. 단순 추가 함수 (기존 유지)
//   const addMyPerfume = (perfume: Perfume) => {
//     const exists = myPerfumes.some((p) => p.perfId === perfume.perfId);
//     if (exists) return;

//     const newMyPerfume: MyPerfume = {
//       userId: "u001",
//       perfId: perfume.perfId,
//       isFavourite: false,
//       addedAt: Date.now(),
//     };
//     setMyPerfumes((prev) => [...prev, newMyPerfume]);
//   };

//   // 2. 즐겨찾기 토글 (리스트에 있을 때만 작동)
//   const toggleFavourite = (perfId: string) => {
//     setMyPerfumes((prev) =>
//       prev.map((p) =>
//         p.perfId === perfId ? { ...p, isFavourite: !p.isFavourite } : p
//       )
//     );
//   };

//   // 3. I Have 토글 (리스트에서 추가 또는 '완전 삭제')
//   const toggleHave = (perfId: string) => {
//     setMyPerfumes((prev) => {
//       const isAlreadyInList = prev.some((p) => p.perfId === perfId);

//       if (isAlreadyInList) {
//         // 이미 리스트에 있다면? -> 삭제해서 리스트에서 없애버림
//         return prev.filter((p) => p.perfId !== perfId);
//       } else {
//         // 리스트에 없다면? -> 새로 추가
//         const newEntry: MyPerfume = {
//           userId: "u001",
//           perfId: perfId,
//           isFavourite: false,
//           addedAt: Date.now(),
//         };
//         return [...prev, newEntry];
//       }
//     });
//   };

//   return (
//     <MyPerfumeContext.Provider
//       value={{ myPerfumes, addMyPerfume, toggleFavourite, toggleHave }}
//     >
//       {children}
//     </MyPerfumeContext.Provider>
//   );
// };

// export const useMyPerfume = () => {
//   const context = useContext(MyPerfumeContext);
//   if (!context) {
//     throw new Error("useMyPerfume must be used within MyPerfumeProvider");
//   }
//   return context;
// };
