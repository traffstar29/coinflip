"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  computeAccuracy,
  getBaseEntryAmount,
  getCooldownRemainingMs,
  getRandomAccuracyThreshold,
  getRandomTargetRounds,
  isCooldownActive,
  nextSyncPercent,
  SESSION_COOLDOWN_MS,
  SESSION_GAME_LIMIT,
  type CoinSide,
  type Currency,
  type GeneratedSignal,
} from "@/lib/signal";

export type Screen = "rules" | "settings" | "loading" | "result" | "cooldown";

type AppState = {
  screen: Screen;
  signal: GeneratedSignal | null;
  actualResult: CoinSide | null;
  /** True once the current round has been counted toward training. */
  resultMarked: boolean;
  /** Number of rounds the user has confirmed in the current session. */
  roundsDone: number;
  /** Random target chosen once per session: 16–20. */
  targetRounds: number;
  /** Threshold (in rounds) until which accuracy stays flat at 50%. */
  accuracyThreshold: number;
  /** Sync bar progress (0–100), advances by a random step each round. */
  syncPercent: number;
  /** Current accuracy percent (50–58). */
  accuracyPercent: number;
  sessionGamesPlayed: number;
  cooldownEndsAt: number | null;
  currentEntryAmount: number;
  userId: string;
  currency: Currency | null;
  depositAmount: number | null;

  telegramUserId: number | null;
  telegramInitData: string;

  goSettings: () => void;
  submitSettings: (payload: {
    userId: string;
    currency: Currency;
    depositAmount: number;
  }) => void;
  goLoading: () => void;
  goResult: (signal: GeneratedSignal) => void;
  markActualResult: (side: CoinSide) => void;
  goRules: () => void;
  syncCooldownState: () => void;

  setTelegramUserId: (id: number | null) => void;
  setTelegramInitData: (data: string) => void;
};

function initialSessionDefaults() {
  return {
    signal: null as GeneratedSignal | null,
    actualResult: null as CoinSide | null,
    resultMarked: false,
    roundsDone: 0,
    targetRounds: getRandomTargetRounds(),
    accuracyThreshold: getRandomAccuracyThreshold(),
    syncPercent: 0,
    accuracyPercent: 50,
    sessionGamesPlayed: 0,
    cooldownEndsAt: null as number | null,
    currentEntryAmount: 0,
  };
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      screen: "rules",
      ...initialSessionDefaults(),
      userId: "",
      currency: null,
      depositAmount: null,
      telegramUserId: null,
      telegramInitData: "",

      goSettings: () =>
        set((state) => ({
          screen: isCooldownActive(state.cooldownEndsAt) ? "cooldown" : "settings",
        })),

      submitSettings: ({ userId, currency, depositAmount }) =>
        set((state) => {
          if (isCooldownActive(state.cooldownEndsAt)) {
            return { screen: "cooldown" };
          }
          const baseEntryAmount = getBaseEntryAmount(depositAmount, currency);
          return {
            ...initialSessionDefaults(),
            screen: "loading",
            userId,
            currency,
            depositAmount,
            currentEntryAmount: baseEntryAmount,
          };
        }),

      goLoading: () =>
        set((state) => {
          if (isCooldownActive(state.cooldownEndsAt)) {
            return { screen: "cooldown" };
          }
          const cooldownExpired = state.cooldownEndsAt != null;
          return {
            screen: "loading",
            signal: null,
            actualResult: null,
            resultMarked: false,
            currentEntryAmount:
              state.depositAmount != null && state.currency
                ? getBaseEntryAmount(state.depositAmount, state.currency)
                : state.currentEntryAmount,
            sessionGamesPlayed: cooldownExpired ? 0 : state.sessionGamesPlayed,
            cooldownEndsAt: cooldownExpired ? null : state.cooldownEndsAt,
          };
        }),

      goResult: (signal) =>
        set({
          screen: "result",
          signal,
          actualResult: null,
          resultMarked: false,
        }),

      markActualResult: (side) =>
        set((state) => {
          if (!state.signal || !state.currency || state.depositAmount == null) {
            return state;
          }
          if (state.resultMarked) {
            return {
              actualResult: side,
            };
          }
          const newRoundsDone = Math.min(state.roundsDone + 1, state.targetRounds);
          const newSync = nextSyncPercent(
            state.syncPercent,
            newRoundsDone,
            state.targetRounds,
          );
          const newAccuracy = computeAccuracy(
            newRoundsDone,
            state.targetRounds,
            state.accuracyThreshold,
          );
          const sessionGamesPlayed = Math.min(
            state.sessionGamesPlayed + 1,
            SESSION_GAME_LIMIT,
          );
          const limitReached = sessionGamesPlayed >= SESSION_GAME_LIMIT;

          return {
            actualResult: side,
            resultMarked: true,
            roundsDone: newRoundsDone,
            syncPercent: newSync,
            accuracyPercent: newAccuracy,
            sessionGamesPlayed,
            cooldownEndsAt: limitReached
              ? Date.now() + SESSION_COOLDOWN_MS
              : state.cooldownEndsAt,
            screen: limitReached ? "cooldown" : state.screen,
          };
        }),

      goRules: () =>
        set((state) => ({
          screen: "rules",
          ...initialSessionDefaults(),
          userId: "",
          currency: null,
          depositAmount: null,
          sessionGamesPlayed: isCooldownActive(state.cooldownEndsAt)
            ? state.sessionGamesPlayed
            : 0,
          cooldownEndsAt: isCooldownActive(state.cooldownEndsAt)
            ? state.cooldownEndsAt
            : null,
        })),

      syncCooldownState: () =>
        set((state) => {
          if (getCooldownRemainingMs(state.cooldownEndsAt) > 0) {
            return state;
          }
          if (state.cooldownEndsAt == null) return state;
          return {
            cooldownEndsAt: null,
            sessionGamesPlayed: 0,
          };
        }),

      setTelegramUserId: (telegramUserId) => set({ telegramUserId }),
      setTelegramInitData: (telegramInitData) => set({ telegramInitData }),
    }),
    {
      name: "profit-machine-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        screen: state.screen,
        signal: state.signal,
        actualResult: state.actualResult,
        resultMarked: state.resultMarked,
        roundsDone: state.roundsDone,
        targetRounds: state.targetRounds,
        accuracyThreshold: state.accuracyThreshold,
        syncPercent: state.syncPercent,
        accuracyPercent: state.accuracyPercent,
        sessionGamesPlayed: state.sessionGamesPlayed,
        cooldownEndsAt: state.cooldownEndsAt,
        currentEntryAmount: state.currentEntryAmount,
        userId: state.userId,
        currency: state.currency,
        depositAmount: state.depositAmount,
      }),
    },
  ),
);
