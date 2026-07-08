import * as SQLite from "expo-sqlite";
import React, { createContext, useContext, useEffect, useState } from "react";

interface UserInfo {
  customCode: string;
  cardholderName: string;
  authCode: string;
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
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS user_info (
            auth_code TEXT PRIMARY KEY,
            custom_code TEXT,
            cardholder_name TEXT
          );
        `);

        const result: any = await db.getFirstAsync(
          "SELECT * FROM user_info LIMIT 1;",
        );

        if (result) {
          const loadedUser = {
            customCode: result.custom_code,
            cardholderName: result.cardholder_name,
            authCode: result.auth_code,
          };
          setUserInfo(loadedUser);
          console.log(
            `✅ [UserContext] User loaded: ${loadedUser.cardholderName} (${loadedUser.authCode})`,
          );
        } else {
          console.log(
            "ℹ️ [UserContext] No user found. Creating initial guest profile...",
          );
          const initialCode = Math.floor(
            100000 + Math.random() * 900000,
          ).toString();
          const guestUser = {
            customCode: "0000",
            cardholderName: "HYANG",
            authCode: initialCode,
          };
          await db.runAsync(
            "INSERT INTO user_info (auth_code, custom_code, cardholder_name) VALUES (?, ?, ?);",
            [
              guestUser.authCode,
              guestUser.customCode,
              guestUser.cardholderName,
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
          cardholder_name = ? 
        WHERE auth_code = ?;`,
        [updated.customCode, updated.cardholderName, updated.authCode],
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
