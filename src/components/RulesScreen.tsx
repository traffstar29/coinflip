"use client";

import { useAppStore } from "@/store/useAppStore";
import promoImg from "../../100hp.png";
import { GlassCard } from "./GlassCard";

export function RulesScreen() {
  const goSettings = useAppStore((s) => s.goSettings);

  return (
    <div className="animate-fade-in pb-36 pt-4">
      <header className="mb-6 flex flex-col items-center text-center">
        <h1 className="bg-gradient-to-r from-amber-200 via-white to-amber-300 bg-clip-text text-3xl font-black tracking-tight text-transparent">
          PROFIT MACHINE
        </h1>
        <p className="mt-2 text-xs uppercase tracking-[0.26em] text-amber-200/70">
          CoinFlip Predictor
        </p>
      </header>

      <div className="mb-6 flex justify-center">
        <img
          src={promoImg.src}
          alt="CoinFlip promo"
          className="h-auto w-full max-w-[160px] object-contain drop-shadow-[0_0_28px_rgba(234,179,8,0.35)]"
        />
      </div>

      <div className="mx-auto flex max-w-lg flex-col gap-4">
        <GlassCard className="p-6">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/70">
            How to use
          </p>
          <ol className="space-y-4 text-[15px] leading-relaxed text-slate-100">
            <li>1. Open the Coinflip game in your casino.</li>
            <li>2. Continue to settings, then start the predictor to get HEADS or TAILS.</li>
            <li>3. Flip the coin in the game and watch where it lands.</li>
            <li>4. On the result screen, tap the side that actually landed.</li>
            <li>5. The more rounds you confirm, the smarter the predictor gets.</li>
            <li>6. Accuracy starts at 50% and improves as synchronization fills up.</li>
          </ol>
        </GlassCard>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-[max(env(safe-area-inset-bottom),16px)] pt-2">
        <div className="mx-auto max-w-lg">
          <button
            type="button"
            onClick={goSettings}
            className="w-full rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 py-4 text-sm font-black uppercase tracking-[0.2em] text-slate-900 shadow-glow transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
