"use client";

import WebApp from "@twa-dev/sdk";

export type TelegramUserPayload = {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
};

export function initTelegramWebApp(): void {
  if (typeof window === "undefined") return;
  try {
    WebApp.ready();
    WebApp.expand();
  } catch {
    /* not inside Telegram or SDK unavailable */
  }
}

export function getTelegramUser(): TelegramUserPayload | null {
  try {
    return WebApp.initDataUnsafe?.user ?? null;
  } catch {
    return null;
  }
}

export function getTelegramInitData(): string {
  try {
    return WebApp.initData ?? "";
  } catch {
    return "";
  }
}
