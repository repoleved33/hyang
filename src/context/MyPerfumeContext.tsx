import { MAX_FAVOURITES, MAX_SHELF_SIZE } from "@/src/constants/Config";
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
  const db = SQLite.openDatabaseSync("hyang_myperfume.db");
  const [myPerfumes, setMyPerfumes] = useState<MyPerfumeWithDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initDB = async () => {
      console.log("📂 [SQLite] Initializing My Perfume Data ...");
      setIsLoading(true);

      try {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS my_perfumes (
            perf_id TEXT PRIMARY KEY NOT NULL,
            is_favourite INTEGER DEFAULT 0,
            added_at INTEGER,
            details_json TEXT
          );
        `);

        await selectMyPerfumes();
        console.log("✅ [SQLite] My Perfumes initialized.");
      } catch (error) {
        console.error("❌ [SQLite] Init failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initDB();
  }, []);

  const selectMyPerfumes = async () => {
    try {
      const allRows = await db.getAllAsync<any>(
        "SELECT * FROM my_perfumes ORDER BY added_at DESC",
      );

      const formattedData: MyPerfumeWithDetail[] = allRows.map((row) => ({
        userId: "u001",
        perfId: row.perf_id,
        isFavourite: row.is_favourite === 1,
        addedAt: row.added_at,
        details: row.details_json ? JSON.parse(row.details_json) : null,
      }));

      setMyPerfumes(formattedData);
    } catch (error) {
      console.error("❌ [SQLite] Select error:", error);
    }
  };

  const addMyPerfume = async (perfume: Perfume) => {
    if (!perfume || !perfume.perfId) return;

    console.log(`💾 [SQLite] Add attempt: ${perfume.name}`);
    try {
      const countRow = await db.getFirstAsync<any>(
        "SELECT COUNT(*) as count FROM my_perfumes",
      );
      const currentCount = countRow?.count || 0;

      if (currentCount >= MAX_SHELF_SIZE) {
        Alert.alert(
          "Shelf is Full! 🧴",
          `Your fragrance shelf is at its limit of ${MAX_SHELF_SIZE}. Remove a scent to add this new discovery.`,
        );
        console.log(
          `⚠️ [SQLite] Shelf limit reached (${currentCount}/${MAX_SHELF_SIZE})`,
        );
        return;
      }

      const exists = await db.getFirstAsync<any>(
        "SELECT * FROM my_perfumes WHERE perf_id = ?",
        [perfume.perfId],
      );

      if (exists) {
        console.log(`ℹ️ [SQLite] '${perfume.name}' already exists.`);
        return;
      }

      const addedAt = Date.now();
      await db.runAsync(
        "INSERT INTO my_perfumes (perf_id, is_favourite, added_at, details_json) VALUES (?, ?, ?, ?)",
        [perfume.perfId, 0, addedAt, JSON.stringify(perfume)],
      );

      console.log(`✨ [SQLite] Saved: ${perfume.name}`);
      await selectMyPerfumes();
    } catch (error) {
      console.error("❌ [SQLite] Add error:", error);
    }
  };

  const toggleHave = async (perfId: string) => {
    console.log(`🗑️ [SQLite] Delete attempt: ${perfId}`);
    try {
      const result = await db.runAsync(
        "DELETE FROM my_perfumes WHERE perf_id = ?",
        [perfId],
      );

      if (result.changes > 0) {
        console.log(`✅ [SQLite] Deleted from shelf: ${perfId}`);
        await selectMyPerfumes();
      }
    } catch (error) {
      console.error("❌ [SQLite] Delete error:", error);
    }
  };

  const toggleFavourite = async (perfId: string) => {
    console.log(`🔄 [SQLite] Toggling favorite for: ${perfId}`);
    try {
      const target = await db.getFirstAsync<any>(
        "SELECT is_favourite FROM my_perfumes WHERE perf_id = ?",
        [perfId],
      );

      if (!target) return;

      const isCurrentFav = target.is_favourite === 1;

      if (!isCurrentFav) {
        const favCountRow = await db.getFirstAsync<any>(
          "SELECT COUNT(*) as count FROM my_perfumes WHERE is_favourite = 1",
        );
        const currentFavCount = favCountRow?.count || 0;
        if (currentFavCount >= MAX_FAVOURITES) {
          Alert.alert(
            "Favourite Wardrobe is Full! ✨",
            `You've reached your limit of ${MAX_FAVOURITES} favourites. Give one a rest to make room for a new one.`,
          );
          console.log(
            `⚠️ [SQLite] Favourite limit reached (Max: ${MAX_FAVOURITES})`,
          );
          return;
        }
      }

      const nextStatus = isCurrentFav ? 0 : 1;

      await db.runAsync(
        "UPDATE my_perfumes SET is_favourite = ? WHERE perf_id = ?",
        [nextStatus, perfId],
      );

      console.log(`${nextStatus ? "❤️" : "🤍"} [SQLite] Fav status updated`);
      await selectMyPerfumes();
    } catch (error) {
      console.error("❌ [SQLite] Toggle Fav error:", error);
    }
  };

  const searchPerfumes = async (
    keyword: string,
    page: number = 0,
  ): Promise<Perfume[]> => {
    if (keyword.trim().length < 1) return [];

    const PAGE_SIZE = 50;
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    console.log(`🔍 [Supabase] Searching: '${keyword}'`);
    const { data, error } = await supabase
      .from("main_perfume_list")
      .select("*")
      .or(`name.ilike.%${keyword}%,brand.ilike.%${keyword}%`)
      .range(from, to);

    if (error) {
      console.error("❌ [Supabase] Search error:", error);
      return [];
    }

    console.log(
      `📡 [Supabase] Found ${data?.length || 0} perfumes. (Range: ${from} ~ ${to})`,
    );
    return (data || []).map((item) => ({
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
  if (!context)
    throw new Error("useMyPerfume must be used within MyPerfumeProvider");
  return context;
};
