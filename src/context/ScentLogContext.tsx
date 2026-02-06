import { ScentLogList } from "@/src/data/dummyDatasLocal";
import { ScentLog } from "@/src/types/scentLog";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type ScentLogContextType = {
  scentLogs: ScentLog[];
  upsertScentLog: (ScentLog: ScentLog) => void;
  deleteScentLog: (idx: number) => void;
};

//define
const ScentLogContext = createContext<ScentLogContextType | undefined>(
  undefined,
);

export const ScentLogProvider = ({ children }: { children: ReactNode }) => {
  // from local DB
  const [scentLogs, setScentLogs] = useState<ScentLog[]>(ScentLogList);

  // debbuging
  useEffect(() => {
    console.log("======================================");
    console.log("📊 [DATA MONITOR] ScentLog Count:", scentLogs.length);

    if (scentLogs.length > 0) {
      // JSON.stringify를 사용하면 터미널에서 데이터를 강제로 펼쳐서 보여줍니다.
      // null, 2는 들여쓰기를 예쁘게 해주는 옵션이에요.
      console.log(JSON.stringify(scentLogs, null, 2));
    } else {
      console.log("Empty List");
    }

    console.log("======================================");
  }, [scentLogs]);

  const upsertScentLog = (newLogData: ScentLog) => {
    setScentLogs((prev) => {
      // check order index in same date
      const existingIdx = prev.findIndex(
        (log) =>
          (newLogData.idx > 0 && log.idx === newLogData.idx) ||
          (log.date === newLogData.date && log.orderIdx == newLogData.orderIdx),
      );
      // update
      if (existingIdx !== -1) {
        return prev.map((log, idx) =>
          idx === existingIdx ? { ...log, ...newLogData } : log,
        );
      } else {
        // check before add
        const logsInSameDate = prev.filter(
          (log) => log.date === newLogData.date,
        );
        const maxOrderIdx =
          logsInSameDate.length > 0
            ? Math.max(...logsInSameDate.map((log) => log.orderIdx))
            : 0;

        if (newLogData.orderIdx > maxOrderIdx + 1) {
          alert("Add Prior Scent!");
          return prev;
        }
        // add new
        const newScentLog: ScentLog = {
          ...newLogData,
          idx:
            scentLogs.length > 0
              ? Math.max(...scentLogs.map((s) => s.idx)) + 1
              : 1,
          userId: "u001", // auth 교체
        };
        console.log([...prev, newScentLog]);
        return [...prev, newScentLog];
      }
    });
  };
  const deleteScentLog = (idx: number) => {
    setScentLogs((prev) => prev.filter((log) => log.idx !== idx));
  };

  return (
    <ScentLogContext.Provider
      value={{ scentLogs, upsertScentLog, deleteScentLog }}
    >
      {children}
    </ScentLogContext.Provider>
  );
};

export const useScentLog = () => {
  const context = useContext(ScentLogContext);
  if (!context) {
    throw new Error("useMyPerfume must be used within MyPerfumeProvider");
  }
  return context;
};
