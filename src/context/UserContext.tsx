import * as SQLite from "expo-sqlite";
import React, { createContext, useContext, useEffect, useState } from "react";

interface UserInfo {
  customCode: string;
  cardholderName: string;
  authCode: string;
  numColumns: number; // 레이아웃 열 수 (1: 1x1, 2: 2x2)
}

interface UserContextType {
  userInfo: UserInfo | null;
  updateUserInfo: (newData: Partial<UserInfo>) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const db = SQLite.useSQLiteContext();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initUser = async () => {
      console.log("📂 [UserContext] Initializing 'user_info' table...");
      try {
        // 테이블 생성 (num_columns 기본값 1)
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS user_info (
            auth_code TEXT PRIMARY KEY,
            custom_code TEXT,
            cardholder_name TEXT,
            num_columns INTEGER DEFAULT 1
          );
        `);

        // 기존 테이블 구조 대비 컬럼 마이그레이션
        try {
          await db.execAsync(`
            ALTER TABLE user_info ADD COLUMN num_columns INTEGER DEFAULT 1;
          `);
        } catch (ignored) {
          // 이미 num_columns가 존재하는 경우 발생하는 에러는 무시
        }

        const result: any = await db.getFirstAsync(
          "SELECT * FROM user_info LIMIT 1;",
        );

        if (result) {
          const loadedUser: UserInfo = {
            customCode: result.custom_code,
            cardholderName: result.cardholder_name,
            authCode: result.auth_code,
            numColumns: result.num_columns ?? 1,
          };
          setUserInfo(loadedUser);
          console.log(
            `✅ [UserContext] User loaded: ${loadedUser.cardholderName} (${loadedUser.authCode}), numColumns: ${loadedUser.numColumns}`,
          );
        } else {
          console.log(
            "ℹ️ [UserContext] No user found. Creating initial guest profile...",
          );
          const initialCode = Math.floor(
            100000 + Math.random() * 900000,
          ).toString();
          const guestUser: UserInfo = {
            customCode: "0000",
            cardholderName: "HYANG",
            authCode: initialCode,
            numColumns: 1,
          };
          await db.runAsync(
            "INSERT INTO user_info (auth_code, custom_code, cardholder_name, num_columns) VALUES (?, ?, ?, ?);",
            [
              guestUser.authCode,
              guestUser.customCode,
              guestUser.cardholderName,
              guestUser.numColumns,
            ],
          );
          setUserInfo(guestUser);
          console.log(
            `✨ [UserContext] New profile created with Auth Code: ${initialCode}`,
          );
        }
      } catch (e) {
        console.error("❌ [UserContext] Initialization Error:", e);
      } finally {
        setIsLoading(false);
      }
    };

    initUser();
  }, []);

  const updateUserInfo = async (newData: Partial<UserInfo>) => {
    if (!userInfo) return;
    const updated = { ...userInfo, ...newData };
    console.log("🔄 [UserContext] Updating User Info in SQLite...");
    try {
      await db.runAsync(
        `UPDATE user_info SET 
          custom_code = ?, 
          cardholder_name = ?,
          num_columns = ? 
        WHERE auth_code = ?;`,
        [
          updated.customCode,
          updated.cardholderName,
          updated.numColumns,
          updated.authCode,
        ],
      );
      setUserInfo(updated);
      console.log(
        "✨ [UserContext] User data successfully synchronized with DB.",
      );
    } catch (e) {
      console.error("❌ [UserContext] Update Error:", e);
    }
  };

  return (
    <UserContext.Provider value={{ userInfo, updateUserInfo, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
