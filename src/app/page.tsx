"use client";

import { useEffect } from "react";
import { CooldownScreen } from "@/components/CooldownScreen";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ResultScreen } from "@/components/ResultScreen";
import { RulesScreen } from "@/components/RulesScreen";
import { SettingsScreen } from "@/components/SettingsScreen";
import { TelegramInit } from "@/components/TelegramInit";
import { useAppStore } from "@/store/useAppStore";

export default function HomePage() {
  const screen = useAppStore((s) => s.screen);
  const syncCooldownState = useAppStore((s) => s.syncCooldownState);

  useEffect(() => {
    syncCooldownState();
  }, [syncCooldownState]);

  return (
    <main className="relative mx-auto min-h-[100dvh] w-full max-w-lg overflow-x-hidden px-4 pb-2 pt-[env(safe-area-inset-top)]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(234,179,8,0.18) 0%, transparent 50%)",
        }}
      />
      <TelegramInit />
      {screen === "rules" && <RulesScreen />}
      {screen === "settings" && <SettingsScreen />}
      {screen === "loading" && <LoadingScreen />}
      {screen === "result" && <ResultScreen />}
      {screen === "cooldown" && <CooldownScreen />}
    </main>
  );
}
