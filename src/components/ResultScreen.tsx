"use client";

import { formatAmount, type CoinSide } from "@/lib/signal";
import { useAppStore } from "@/store/useAppStore";
import headsImg from "../../heads.png";
import tailsImg from "../../tails.png";
import { GlassCard } from "./GlassCard";

const COIN_IMG: Record<CoinSide, string> = {
  HEADS: headsImg.src,
  TAILS: tailsImg.src,
};

export function ResultScreen() {
  const signal = useAppStore((s) => s.signal);
  const actualResult = useAppStore((s) => s.actualResult);
  const syncPercent = useAppStore((s) => s.syncPercent);
  const accuracyPercent = useAppStore((s) => s.accuracyPercent);
  const currentEntryAmount = useAppStore((s) => s.currentEntryAmount);
  const currency = useAppStore((s) => s.currency);
  const markActualResult = useAppStore((s) => s.markActualResult);
  const goLoading = useAppStore((s) => s.goLoading);
  const goRules = useAppStore((s) => s.goRules);

  if (!signal || !currency) return null;

  const predictedSide = signal.side;
  const syncRounded = Math.round(syncPercent);
  const accuracyDisplay = Math.round(accuracyPercent).toString();
  const accuracyBarFill = Math.max(
    0,
    Math.min(100, ((accuracyPercent - 50) / 8) * 100),
  );

  return (
    <div className="animate-fade-in pb-24 pt-4">
      <header className="mb-4 text-center">
        <h2 className="bg-gradient-to-r from-amber-200 to-yellow-300 bg-clip-text text-2xl font-black tracking-tight text-transparent">
          PROFIT MACHINE
        </h2>
        <p className="mt-1 text-xs uppercase tracking-[0.3em] text-amber-200/70">
          Prediction ready
        </p>
      </header>

      <div className="mx-auto flex max-w-lg flex-col items-center gap-4">
        <div className="rounded-3xl border border-amber-300/40 bg-amber-300/10 px-8 py-4 shadow-[0_0_45px_rgba(234,179,8,0.3)]">
          <img
            src={COIN_IMG[predictedSide]}
            alt={predictedSide}
            className="mx-auto h-28 w-28 object-contain drop-shadow-[0_0_32px_rgba(234,179,8,0.55)] sm:h-32 sm:w-32"
          />
          <div className="mt-2 text-center text-3xl font-black tracking-[0.26em] text-amber-200 sm:text-4xl">
            {predictedSide}
          </div>
        </div>

        <GlassCard className="w-full p-4">
          <BarRow
            label="Amount to enter"
            value={`${formatAmount(currentEntryAmount, currency)} ${currency}`}
          />
        </GlassCard>

        <GlassCard className="w-full p-4" glow>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">
            What was the actual result?
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <MarkButton
              side="HEADS"
              active={actualResult === "HEADS"}
              onClick={() => markActualResult("HEADS")}
            />
            <MarkButton
              side="TAILS"
              active={actualResult === "TAILS"}
              onClick={() => markActualResult("TAILS")}
            />
          </div>
          {actualResult && (
            <p className="mt-2 text-xs text-emerald-300">
              Result saved. You can still change it before the next signal.
            </p>
          )}
        </GlassCard>

        <GlassCard className="w-full p-4">
          <BarRow label="Synchronization" value={`${syncRounded}%`} />
          <Bar
            fill={syncRounded}
            className="bg-gradient-to-r from-amber-400 to-yellow-300"
          />

          <div className="mt-4">
            <BarRow
              label="Prediction accuracy"
              value={`${accuracyDisplay}%`}
              tone="emerald"
            />
            <Bar
              fill={accuracyBarFill}
              className="bg-gradient-to-r from-emerald-400 to-emerald-200"
            />
          </div>

          <p className="mt-2 text-xs text-slate-400">
            Accuracy improves the more results you mark.
          </p>
        </GlassCard>

        <div className="flex w-full flex-col gap-3">
          <button
            type="button"
            disabled={!actualResult}
            onClick={goLoading}
            className="w-full rounded-2xl border border-amber-300/40 bg-amber-300/15 py-4 text-sm font-bold uppercase tracking-wider text-amber-100 transition hover:bg-amber-300/25 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next Prediction
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

type MarkButtonProps = {
  side: CoinSide;
  active: boolean;
  onClick: () => void;
};

function MarkButton({ side, active, onClick }: MarkButtonProps) {
  const label = side === "HEADS" ? "Heads" : "Tails";
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-bold uppercase tracking-wider transition",
        active
          ? "border-amber-300/70 bg-amber-300/25 text-amber-50 shadow-glow-sm"
          : "border-amber-300/40 bg-amber-300/10 text-amber-100 hover:bg-amber-300/20",
      ].join(" ")}
    >
      <img src={COIN_IMG[side]} alt="" className="h-7 w-7 object-contain" />
      {label}
    </button>
  );
}

type BarRowProps = {
  label: string;
  value: string;
  tone?: "amber" | "emerald";
};

function BarRow({ label, value, tone = "amber" }: BarRowProps) {
  const toneClass =
    tone === "emerald" ? "text-emerald-200/80" : "text-amber-200/80";
  return (
    <div
      className={`flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] ${toneClass}`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

type BarProps = {
  fill: number;
  className: string;
};

function Bar({ fill, className }: BarProps) {
  return (
    <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className={`h-full rounded-full transition-all duration-500 ${className}`}
        style={{ width: `${fill}%` }}
      />
    </div>
  );
}
