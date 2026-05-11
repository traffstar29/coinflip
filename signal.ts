export type CoinSide = "HEADS" | "TAILS";
export type Currency = "NGN" | "XAF" | "XOF" | "USD";

export type GeneratedSignal = {
  side: CoinSide;
};

export const SESSION_GAME_LIMIT = 50;
export const SESSION_COOLDOWN_MS = 12 * 60 * 60 * 1000;

const LOADING_STATUS_MESSAGES = [
  "Analyzing flip patterns...",
  "Calibrating coin physics...",
  "Reading momentum data...",
  "Locking in the signal...",
] as const;

export const CURRENCIES: readonly Currency[] = ["USD", "NGN", "XAF", "XOF"];

/** Picks 2–3 unique status messages in random order. */
export function pickLoadingStatusSequence(): string[] {
  const pool = Array.from(LOADING_STATUS_MESSAGES);
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = pool[i];
    const next = pool[j];
    if (current === undefined || next === undefined) {
      continue;
    }
    pool[i] = next;
    pool[j] = current;
  }
  const count = 2 + Math.floor(Math.random() * 2);
  return pool.slice(0, count);
}

/** Loading screen total duration in ms (3000–4000). */
export function getRandomLoadingDurationMs(): number {
  return 3000 + Math.random() * 1000;
}

export function getMinimumDeposit(currency: Currency): number {
  if (currency === "NGN") return 3000;
  if (currency === "USD") return 2;
  return 1300;
}

export function getMinimumEntryAmount(currency: Currency): number {
  if (currency === "NGN") return 150;
  if (currency === "USD") return 0.1;
  return 65;
}

export function getBaseEntryAmount(
  depositAmount: number,
  currency: Currency,
): number {
  return (
    (depositAmount / getMinimumDeposit(currency)) *
    getMinimumEntryAmount(currency)
  );
}

export function formatAmount(amount: number, currency: Currency): string {
  const fractionDigits = currency === "USD" ? 2 : 0;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
}

export function isCooldownActive(cooldownEndsAt: number | null): boolean {
  return cooldownEndsAt != null && cooldownEndsAt > Date.now();
}

export function getCooldownRemainingMs(cooldownEndsAt: number | null): number {
  if (cooldownEndsAt == null) return 0;
  return Math.max(0, cooldownEndsAt - Date.now());
}

export function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((value) => value.toString().padStart(2, "0"))
    .join(":");
}

/** Total rounds in a session: 16–20. */
export function getRandomTargetRounds(): number {
  return 16 + Math.floor(Math.random() * 5);
}

/** Number of "warm-up" rounds during which accuracy stays at 50%: 4–5. */
export function getRandomAccuracyThreshold(): number {
  return 4 + Math.floor(Math.random() * 2);
}

export function generateSignal(): GeneratedSignal {
  return { side: Math.random() < 0.5 ? "HEADS" : "TAILS" };
}

/**
 * Computes the new sync percent after a confirmed round.
 * Each step adds a random fraction of the remaining progress, so the bar
 * looks "alive" but always lands exactly at 100% on the final round.
 */
export function nextSyncPercent(
  currentPercent: number,
  roundsDone: number,
  targetRounds: number,
): number {
  if (roundsDone >= targetRounds) return 100;
  const remainingRounds = targetRounds - (roundsDone - 1);
  if (remainingRounds <= 1) return 100;
  const remainingPercent = 100 - currentPercent;
  const avgStep = remainingPercent / remainingRounds;
  const jitter = 0.45 + Math.random() * 1.1;
  const step = Math.min(avgStep * jitter, remainingPercent - 1);
  return Math.min(100, currentPercent + Math.max(step, 0.5));
}

/**
 * Accuracy stays at 50% for the first `threshold` rounds, then climbs
 * linearly up to 58% by the time the last round is marked.
 * The displayed value is always a whole number.
 */
export function computeAccuracy(
  roundsDone: number,
  targetRounds: number,
  threshold: number,
): number {
  if (roundsDone <= threshold) return 50;
  const span = Math.max(1, targetRounds - threshold);
  const progressed = Math.min(roundsDone - threshold, span);
  return Math.min(58, Math.round(50 + (progressed / span) * 8));
}
