import { ScentLog } from "@/src/types/scentLog";
import * as SQLite from "expo-sqlite";
import React, { createContext, useContext, useEffect, useState } from "react";

interface ScentLogContextType {
  scentLogs: any[];
  clearAllLogs: () => Promise<void>;
  upsertScentLog: (logData: ScentLog, perfumeDetails?: any) => Promise<void>;
  deleteScentLog: (idx: number) => Promise<void>;
  selectLogs: () => Promise<void>;
  isLoading: boolean;
}

const ScentLogContext = createContext<ScentLogContextType | undefined>(
  undefined,
);

export const ScentLogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const db = SQLite.useSQLiteContext();
  const [scentLogs, setScentLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initDB = async () => {
      console.log("📂 [SQLite] Resetting Scent logs Data ...");
      setIsLoading(true);

      try {
        await db.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS scent_logs (
            idx INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT,
            date TEXT,
            perfId TEXT,
            orderIdx INTEGER,
            details_json TEXT 
          );
        `);

        await selectLogs();
        console.log("✅ [SQLite] Scent logs initialized.");
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
      const allRows = await db.getAllAsync<any>(
        "SELECT * FROM scent_logs ORDER BY date DESC, orderIdx ASC",
      );

      const formattedRows = allRows.map((row) => ({
        ...row,
        details: row.details_json ? JSON.parse(row.details_json) : null,
      }));

      setScentLogs(formattedRows);
    } catch (error) {
      console.error("❌ [SQLite] Select error:", error);
    }
  };

  const upsertScentLog = async (logData: ScentLog, perfumeDetails?: any) => {
    console.log(
      `💾 [SQLite] Upsert attempt: ${logData.date}, Slot #: ${logData.orderIdx}`,
    );
    try {
      const existing = await db.getFirstAsync<any>(
        "SELECT * FROM scent_logs WHERE date = ? AND orderIdx = ?",
        [logData.date, logData.orderIdx],
      );

      const detailsStr = perfumeDetails ? JSON.stringify(perfumeDetails) : null;

      if (existing) {
        console.log(`🔄 [SQLite] Updating existing log (idx: ${existing.idx})`);
        await db.runAsync(
          "UPDATE scent_logs SET perfId = ?, details_json = ? WHERE idx = ?",
          [logData.perfId, detailsStr, existing.idx],
        );
      } else {
        console.log(`➕ [SQLite] Inserting new log`);
        await db.runAsync(
          "INSERT INTO scent_logs (userId, date, perfId, orderIdx, details_json) VALUES (?, ?, ?, ?, ?)",
          [
            logData.userId,
            logData.date,
            logData.perfId,
            logData.orderIdx,
            detailsStr,
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
      const result = await db.runAsync("DELETE FROM scent_logs WHERE idx = ?", [
        idx,
      ]);
      if (result.changes > 0) {
        console.log(`🗑️ [SQLite] Deleted idx: ${idx}`);
        await selectLogs();
      }
    } catch (error) {
      console.error("❌ [SQLite] Delete error:", error);
    }
  };

  const clearAllLogs = async () => {
    try {
      await db.runAsync("DELETE FROM scent_logs");
      await db.runAsync("DELETE FROM sqlite_sequence WHERE name='scent_logs'");
      await selectLogs();
      console.log("🧹 [SQLite] All Scent logs deleted.");
    } catch (error) {
      console.error("❌ [SQLite] Clear all Scent logs failed", error);
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
  if (!context)
    throw new Error("useScentLog must be used within ScentLogProvider");
  return context;
};
