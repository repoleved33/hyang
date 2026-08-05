import { MAX_FAVOURITES, MAX_SHELF_SIZE } from "@/src/constants/Config";
import { useUser } from "@/src/context/UserContext";
import { supabase } from "@/src/lib/supabase";
import { MyPerfumeWithDetail, Perfume } from "@/src/types/perfume";
import * as SQLite from "expo-sqlite";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert } from "react-native";

type MyPerfumeContextType = {
  myPerfumes: MyPerfumeWithDetail[];
  addMyPerfume: (perfume: Perfume) => Promise<void>;
  toggleFavourite: (perfId: string) => Promise<void>;
  toggleHave: (perfId: string) => Promise<void>;
  searchPerfumes: (keyword: string, page?: number) => Promise<Perfume[]>;
  selectMyPerfumes: () => Promise<void>;
  isLoading: boolean;
};

const MyPerfumeContext = createContext<MyPerfumeContextType | undefined>(
  undefined,
);

export const MyPerfumeProvider = ({ children }: { children: ReactNode }) => {
  const db = SQLite.useSQLiteContext();
  const { userInfo } = useUser();

  const [myPerfumes, setMyPerfumes] = useState<MyPerfumeWithDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initDB = async () => {
      try {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS my_perfumes (
            perf_id TEXT PRIMARY KEY NOT NULL,
            is_favourite INTEGER DEFAULT 0,
            added_at INTEGER
          );
        `);

        await selectMyPerfumes();
      } catch (error) {
        console.error("❌ SQLite Init error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initDB();
  }, []);

  const selectMyPerfumes = async () => {
    console.log("🔥 selectMyPerfumes called");

    try {
      const rows = await db.getAllAsync<any>(
        `
        SELECT *
        FROM my_perfumes
        ORDER BY added_at DESC
        `,
      );

      if (rows.length === 0) {
        setMyPerfumes([]);
        return;
      }

      const ids = rows.map((row) => row.perf_id);

      const { data, error } = await supabase
        .from("main_perfume_list")
        .select("*")
        .in("perf_id", ids);

      if (error) throw error;

      const result = rows.map((row) => {
        const detail = data?.find((item) => item.perf_id === row.perf_id);

        return {
          userId: userInfo?.authCode ?? "",
          perfId: row.perf_id,
          isFavourite: row.is_favourite === 1,
          addedAt: row.added_at,

          // master DB에서 삭제된 데이터 여부
          isDeleted: !detail,

          details: detail
            ? {
                ...detail,
                perfId: detail.perf_id,
              }
            : null,
        };
      });

      setMyPerfumes(result as MyPerfumeWithDetail[]);
    } catch (error) {
      console.error("❌ Select My Perfume error:", error);
    }
  };

  const addMyPerfume = async (perfume: Perfume) => {
    if (!perfume?.perfId) return;

    try {
      const count = await db.getFirstAsync<any>(
        `
        SELECT COUNT(*) as count
        FROM my_perfumes
        `,
      );

      if ((count?.count ?? 0) >= MAX_SHELF_SIZE) {
        Alert.alert("Shelf is Full!");
        return;
      }

      const exists = await db.getFirstAsync<any>(
        `
        SELECT *
        FROM my_perfumes
        WHERE perf_id = ?
        `,
        [perfume.perfId],
      );

      if (exists) return;

      await db.runAsync(
        `
        INSERT INTO my_perfumes
        (
          perf_id,
          is_favourite,
          added_at
        )
        VALUES (?, ?, ?)
        `,
        [perfume.perfId, 0, Date.now()],
      );

      await selectMyPerfumes();
    } catch (error) {
      console.error("❌ Add error:", error);
    }
  };

  const toggleHave = async (perfId: string) => {
    try {
      await db.runAsync(
        `
        DELETE FROM my_perfumes
        WHERE perf_id = ?
        `,
        [perfId],
      );

      await selectMyPerfumes();
    } catch (error) {
      console.error("❌ Delete error:", error);
    }
  };

  const toggleFavourite = async (perfId: string) => {
    try {
      const target = await db.getFirstAsync<any>(
        `
        SELECT is_favourite
        FROM my_perfumes
        WHERE perf_id = ?
        `,
        [perfId],
      );

      if (!target) return;

      const current = target.is_favourite === 1;

      if (!current) {
        const favCount = await db.getFirstAsync<any>(
          `
          SELECT COUNT(*) as count
          FROM my_perfumes
          WHERE is_favourite = 1
          `,
        );

        if ((favCount?.count ?? 0) >= MAX_FAVOURITES) {
          Alert.alert("Favourite limit reached");
          return;
        }
      }

      await db.runAsync(
        `
        UPDATE my_perfumes
        SET is_favourite = ?
        WHERE perf_id = ?
        `,
        [current ? 0 : 1, perfId],
      );

      await selectMyPerfumes();
    } catch (error) {
      console.error("❌ Favourite error:", error);
    }
  };

  const searchPerfumes = async (
    keyword: string,
    page: number = 0,
  ): Promise<Perfume[]> => {
    if (!keyword.trim()) return [];

    // 1. 순수 알파벳/숫자만 남긴 키워드
    const cleanKeyword = keyword.replace(/[^a-zA-Z0-9]/g, "");
    if (!cleanKeyword) return [];

    // 2. 입력된 검색어 자체를 다루는 패턴
    // 단어 내부의 공백이나 특수문자 자리에만 %를 허용하는 방식
    const exactLike = `%${cleanKeyword}%`; // 일반 ilike (%papier%)

    const PAGE_SIZE = 50;

    // 정확히 papier가 포함된 항목을 우선 검색
    const { data, error } = await supabase
      .from("main_perfume_list")
      .select("*")
      .or(`name.ilike.${exactLike},brand.ilike.${exactLike}`)
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

    if (error) {
      console.error(error);
      return [];
    }

    return (data ?? []).map((item) => ({
      ...item,
      perfId: item.perf_id,
    }));
  };

  return (
    <MyPerfumeContext.Provider
      value={{
        myPerfumes,
        addMyPerfume,
        toggleFavourite,
        toggleHave,
        searchPerfumes,
        selectMyPerfumes,
        isLoading,
      }}
    >
      {children}
    </MyPerfumeContext.Provider>
  );
};

export const useMyPerfume = () => {
  const context = useContext(MyPerfumeContext);

  if (!context) {
    throw new Error("useMyPerfume must be used within MyPerfumeProvider");
  }

  return context;
};
