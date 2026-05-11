"use client";

import { useEffect } from "react";
import {
  getTelegramInitData,
  getTelegramUser,
  initTelegramWebApp,
} from "@/lib/telegram";
import { useAppStore } from "@/store/useAppStore";

/** initData available for future backend via store or window */
export function TelegramInit() {
  const setTelegramUserId = useAppStore((s) => s.setTelegramUserId);
  const setTelegramInitData = useAppStore((s) => s.setTelegramInitData);

  useEffect(() => {
    initTelegramWebApp();
    const user = getTelegramUser();
    if (user?.id != null) setTelegramUserId(user.id);
    setTelegramInitData(getTelegramInitData());
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.debug("[telegram] initData length:", getTelegramInitData().length);
    }
  }, [setTelegramInitData, setTelegramUserId]);

  return null;
}
