"use client";

import { useState } from "react";
import {
  CURRENCIES,
  formatAmount,
  getMinimumDeposit,
  type Currency,
} from "@/lib/signal";
import { useAppStore } from "@/store/useAppStore";
import { GlassCard } from "./GlassCard";

type FieldErrors = {
  userId?: string;
  currency?: string;
  depositAmount?: string;
};

export function SettingsScreen() {
  const savedUserId = useAppStore((s) => s.userId);
  const savedCurrency = useAppStore((s) => s.currency);
  const savedDepositAmount = useAppStore((s) => s.depositAmount);
  const submitSettings = useAppStore((s) => s.submitSettings);
  const goRules = useAppStore((s) => s.goRules);

  const [userId, setUserId] = useState(savedUserId);
  const [currency, setCurrency] = useState<Currency | null>(savedCurrency);
  const [depositAmount, setDepositAmount] = useState(
    savedDepositAmount?.toString() ?? "",
  );
  const [errors, setErrors] = useState<FieldErrors>({});

  const minimumDeposit = currency ? getMinimumDeposit(currency) : null;

  const validate = (): FieldErrors => {
    const nextErrors: FieldErrors = {};

    if (!/^\d{6,10}$/.test(userId)) {
      nextErrors.userId = "Invalid ID";
    }

    if (!currency) {
      nextErrors.currency = "Select your currency.";
    }

    if (!currency && depositAmount) {
      nextErrors.depositAmount = "Select a currency before entering your deposit.";
    } else if (currency && !/^\d+$/.test(depositAmount)) {
      nextErrors.depositAmount = "Enter your deposit as a whole number.";
    } else if (currency && Number(depositAmount) < getMinimumDeposit(currency)) {
      nextErrors.depositAmount = `Please make a deposit of at least ${formatAmount(getMinimumDeposit(currency), currency)} ${currency}.`;
    }

    return nextErrors;
  };

  const handleSubmit = () => {
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || !currency) {
      return;
    }

    submitSettings({
      userId,
      currency,
      depositAmount: Number(depositAmount),
    });
  };

  return (
    <div className="animate-fade-in pb-44 pt-4">
      <header className="mb-6 text-center">
        <h2 className="bg-gradient-to-r from-amber-200 to-yellow-300 bg-clip-text text-2xl font-black tracking-tight text-transparent">
          PROFIT MACHINE
        </h2>
        <p className="mt-2 text-xs uppercase tracking-[0.26em] text-amber-200/70">
          Session settings
        </p>
      </header>

      <div className="mx-auto flex max-w-lg flex-col gap-4">
        <GlassCard className="p-6">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/70">
            Before you start
          </p>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                Your ID
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value.trim());
                  if (errors.userId) {
                    setErrors((current) => ({ ...current, userId: undefined }));
                  }
                }}
                placeholder="Enter your numeric ID"
                className="w-full rounded-2xl border border-amber-200/15 bg-white/5 px-4 py-3 text-base text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-amber-300/50 focus:bg-white/10"
              />
              {errors.userId && (
                <p className="mt-2 text-sm text-rose-300">{errors.userId}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                Currency
              </label>
              <select
                value={currency ?? ""}
                onChange={(e) => {
                  const value = e.target.value as Currency | "";
                  setCurrency(value ? value : null);
                  setErrors((current) => ({
                    ...current,
                    currency: undefined,
                    depositAmount: undefined,
                  }));
                }}
                className="w-full rounded-2xl border border-amber-200/15 bg-white/5 px-4 py-3 text-base font-semibold text-slate-100 outline-none transition focus:border-amber-300/50 focus:bg-white/10"
              >
                <option value="" className="bg-slate-900 text-slate-300">
                  Select your currency
                </option>
                {CURRENCIES.map((item) => (
                  <option
                    key={item}
                    value={item}
                    className="bg-slate-900 text-slate-100"
                  >
                    {item}
                  </option>
                ))}
              </select>
              {errors.currency && (
                <p className="mt-2 text-sm text-rose-300">{errors.currency}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                Deposit amount
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={depositAmount}
                onChange={(e) => {
                  setDepositAmount(e.target.value.replace(/\D/g, ""));
                  if (errors.depositAmount) {
                    setErrors((current) => ({
                      ...current,
                      depositAmount: undefined,
                    }));
                  }
                }}
                placeholder={
                  currency
                    ? `Enter your deposit in ${currency}`
                    : "Select a currency first"
                }
                className="w-full rounded-2xl border border-amber-200/15 bg-white/5 px-4 py-3 text-base text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-amber-300/50 focus:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!currency}
              />
              {minimumDeposit != null && currency && (
                <p className="mt-2 text-xs text-slate-400">
                  Minimum deposit: {formatAmount(minimumDeposit, currency)} {currency}
                </p>
              )}
              {errors.depositAmount && (
                <p className="mt-2 text-sm text-rose-300">
                  {errors.depositAmount}
                </p>
              )}
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-[max(env(safe-area-inset-bottom),16px)] pt-2">
        <div className="mx-auto flex max-w-lg flex-col gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 py-4 text-sm font-black uppercase tracking-[0.2em] text-slate-900 shadow-glow transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
          >
            Start Predictor
          </button>
          <button
            type="button"
            onClick={goRules}
            className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 text-sm font-bold uppercase tracking-wider text-slate-200 transition hover:bg-white/10"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
