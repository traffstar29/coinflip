"use client";

import { useEffect, useState } from "react";
import {
  formatCountdown,
  getCooldownRemainingMs,
  SESSION_GAME_LIMIT,
} from "@/lib/signal";
import { useAppStore } from "@/store/useAppStore";
import { GlassCard } from "./GlassCard";

export function CooldownScreen() {
  const cooldownEndsAt = useAppStore((s) => s.cooldownEndsAt);
  const goLoading = useAppStore((s) => s.goLoading);
  const goRules = useAppStore((s) => s.goRules);
  const syncCooldownState = useAppStore((s) => s.syncCooldownState);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    syncCooldownState();
    const timer = window.setInterval(() => {
      setNow(Date.now());
      syncCooldownState();
    }, 1000);
    return () => clearInterval(timer);
  }, [syncCooldownState]);

  const remainingMs = getCooldownRemainingMs(cooldownEndsAt);

  const isLocked = remainingMs > 0;

  return (
    <div className="animate-fade-in flex min-h-[78vh] flex-col justify-center pb-20 pt-4">
      <header className="mb-5 text-center">
        <h2 className="bg-gradient-to-r from-amber-200 to-yellow-300 bg-clip-text text-2xl font-black tracking-tight text-transparent">
          PROFIT MACHINE
        </h2>
        <p className="mt-2 text-xs uppercase tracking-[0.28em] text-amber-200/70">
          Session cooldown
        </p>
      </header>

      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <GlassCard className="p-6 text-center" glow>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-100">
            Session limit reached
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate-200">
            You have reached the {SESSION_GAME_LIMIT}-game limit for this
            session. Please come back in 12 hours to unlock the next signal.
          </p>

          <div className="mt-6 rounded-3xl border border-amber-300/30 bg-amber-300/10 px-6 py-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-200/70">
              Time remaining
            </p>
            <div className="mt-2 text-4xl font-black tracking-[0.14em] text-amber-100">
              {formatCountdown(remainingMs)}
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            {isLocked
              ? "The predictor will unlock automatically when the timer ends."
              : "The cooldown has ended. You can use the predictor again."}
          </p>
        </GlassCard>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            disabled={isLocked}
            onClick={goLoading}
            className="w-full rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 py-4 text-sm font-black uppercase tracking-[0.2em] text-slate-900 shadow-glow transition-all duration-300 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLocked ? "Predictor locked" : "Get Next Signal"}
          </button>
          <button
            type="button"
            onClick={goRules}
            className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 text-sm font-bold uppercase tracking-wider text-slate-200 transition hover:bg-white/10"
          >
            Back to Rules
          </button>
        </div>
      </div>
    </div>
  );
}
