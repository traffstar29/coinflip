"use client";

import { useEffect, useRef, useState } from "react";
import {
  generateSignal,
  getRandomLoadingDurationMs,
  pickLoadingStatusSequence,
} from "@/lib/signal";
import { useAppStore } from "@/store/useAppStore";
import loadingBg from "../../loading.png";

const MAIN_STATUS = "Predicting the next flip...";

export function LoadingScreen() {
  const goResult = useAppStore((s) => s.goResult);
  const messagesRef = useRef<string[]>(pickLoadingStatusSequence());
  const [subStatus, setSubStatus] = useState(
    () => messagesRef.current[0] ?? MAIN_STATUS,
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      goResult(generateSignal());
    }, getRandomLoadingDurationMs());
    return () => clearTimeout(timer);
  }, [goResult]);

  useEffect(() => {
    const messages = messagesRef.current;
    let idx = 0;
    let timer: number | undefined;
    const tick = () => {
      timer = window.setTimeout(() => {
        idx = (idx + 1) % messages.length;
        setSubStatus(messages[idx] ?? MAIN_STATUS);
        tick();
      }, 900 + Math.random() * 700);
    };
    tick();
    return () => {
      if (timer != null) clearTimeout(timer);
    };
  }, []);

  return (
    <div className="animate-fade-in relative flex min-h-[80vh] flex-col items-center justify-center px-4 pb-16 pt-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[60vh] max-w-lg rounded-3xl bg-cover bg-center opacity-60"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(7,16,31,0) 35%, rgba(7,16,31,0.85) 100%), url(${loadingBg.src})`,
        }}
      />

      <header className="mb-8 text-center">
        <h2 className="bg-gradient-to-r from-amber-200 to-yellow-300 bg-clip-text text-2xl font-black tracking-tight text-transparent">
          PROFIT MACHINE
        </h2>
        <p className="mt-1 text-xs uppercase tracking-[0.3em] text-amber-200/70">
          Generating signal
        </p>
      </header>

      <div className="relative h-44 w-44 sm:h-52 sm:w-52">
        <div
          aria-hidden
          className="absolute inset-0 rounded-full border-[10px] border-white/10"
        />
        <div
          aria-hidden
          className="absolute inset-0 animate-spin rounded-full border-[10px] border-transparent border-t-amber-300 border-r-amber-400/60 drop-shadow-[0_0_24px_rgba(234,179,8,0.55)]"
          style={{ animationDuration: "1.1s" }}
        />
      </div>

      <p className="mt-10 text-xs font-bold uppercase tracking-[0.35em] text-amber-300/90">
        Processing
      </p>

      <div className="mt-6 w-full max-w-md space-y-2 text-center">
        <p className="text-sm font-medium text-slate-200">{MAIN_STATUS}</p>
        <p className="min-h-[1.25rem] text-xs text-slate-400 transition-all duration-300">
          {subStatus}
        </p>
      </div>
    </div>
  );
}
