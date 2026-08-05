import { supabase } from "@/src/lib/supabase";
import { ScentLog } from "@/src/types/scentLog";
import * as SQLite from "expo-sqlite";
import React, { createContext, useContext, useEffect, useState } from "react";

interface ScentLogContextType {
  scentLogs: any[];
  clearAllLogs: () => Promise<void>;
  upsertScentLog: (logData: ScentLog) => Promise<void>;
  deleteScentLog: (idx: number) => Promise<void>;
  selectLogs: () => Promise<void>;
  isLoading: boolean;
}

const ScentLogContext = createContext<ScentLogContextType | undefined>(
  undefined,
);

export const ScentLogProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const db = SQLite.useSQLiteContext();

  const [scentLogs, setScentLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initDB = async () => {
      console.log("📂 [SQLite] Initializing Scent Logs...");

      try {
        await db.execAsync(`
        CREATE TABLE IF NOT EXISTS scent_logs (
          idx INTEGER PRIMARY KEY AUTOINCREMENT,
          userId TEXT,
          date TEXT,
          perfId TEXT,
          orderIdx INTEGER
        );
`);

        // Migration: add new columns if they don't exist
        const columns = await db.getAllAsync<any>(
          `
            PRAGMA table_info(scent_logs);
          `,
        );

        const columnNames = columns.map((column) => column.name);

        // 기존 사용자 DB 대응
        if (!columnNames.includes("brand")) {
          await db.execAsync(`
            ALTER TABLE scent_logs
            ADD COLUMN brand TEXT;
          `);
        }

        if (!columnNames.includes("name")) {
          await db.execAsync(`
            ALTER TABLE scent_logs
            ADD COLUMN name TEXT;
          `);
        }

        await selectLogs();

        console.log("✅ [SQLite] Scent Logs initialized.");
      } catch (error) {
        console.error("❌ [SQLite] Init failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initDB();
  }, []);

  const selectLogs = async () => {
    try {
      const rows = await db.getAllAsync<any>(
        `
      SELECT *
      FROM scent_logs
      ORDER BY date DESC, orderIdx ASC
      `,
      );

      if (rows.length === 0) {
        setScentLogs([]);
        return;
      }

      const perfIds = [...new Set(rows.map((row) => row.perfId))];

      const { data, error } = await supabase
        .from("main_perfume_list")
        .select("perf_id, image_url")
        .in("perf_id", perfIds);

      if (error) throw error;

      const result = rows.map((row) => {
        const perfume = data?.find((p) => p.perf_id === row.perfId);

        return {
          ...row,
          imageUrl: perfume?.image_url ?? null,
        };
      });

      setScentLogs(result);
    } catch (error) {
      console.error("❌ [SQLite] Select error:", error);
    }
  };

  const upsertScentLog = async (logData: ScentLog) => {
    try {
      const existing = await db.getFirstAsync<any>(
        `
        SELECT *
        FROM scent_logs
        WHERE date = ?
        AND orderIdx = ?
        `,
        [logData.date, logData.orderIdx],
      );

      if (existing) {
        await db.runAsync(
          `
          UPDATE scent_logs
          SET 
            perfId = ?,
            brand = ?,
            name = ?
          WHERE idx = ?
          `,
          [logData.perfId, logData.brand, logData.name, existing.idx],
        );
      } else {
        await db.runAsync(
          `
          INSERT INTO scent_logs
          (
            userId,
            date,
            perfId,
            brand,
            name,
            orderIdx
          )
          VALUES (?, ?, ?, ?, ?, ?)
          `,
          [
            logData.userId,
            logData.date,
            logData.perfId,
            logData.brand,
            logData.name,
            logData.orderIdx,
          ],
        );
      }

      await selectLogs();
    } catch (error) {
      console.error("❌ [SQLite] Upsert error:", error);
    }
  };

  const deleteScentLog = async (idx: number) => {
    try {
      const result = await db.runAsync(
        `
        DELETE FROM scent_logs
        WHERE idx = ?
        `,
        [idx],
      );

      if (result.changes > 0) {
        await selectLogs();
      }
    } catch (error) {
      console.error("❌ [SQLite] Delete error:", error);
    }
  };

  const clearAllLogs = async () => {
    try {
      await db.runAsync(
        `
        DELETE FROM scent_logs
        `,
      );

      await db.runAsync(
        `
        DELETE FROM sqlite_sequence
        WHERE name='scent_logs'
        `,
      );

      await selectLogs();
    } catch (error) {
      console.error("❌ [SQLite] Clear error:", error);
    }
  };

  return (
    <ScentLogContext.Provider
      value={{
        scentLogs,
        clearAllLogs,
        upsertScentLog,
        deleteScentLog,
        selectLogs,
        isLoading,
      }}
    >
      {children}
    </ScentLogContext.Provider>
  );
};

export const useScentLog = () => {
  const context = useContext(ScentLogContext);

  if (!context) {
    throw new Error("useScentLog must be used within ScentLogProvider");
  }

  return context;
};
