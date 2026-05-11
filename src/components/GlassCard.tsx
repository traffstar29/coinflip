import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  /** Allow dropdowns/menus to extend outside the card (Telegram WebView). Default: true */
  allowOverflow?: boolean;
};

export function GlassCard({
  children,
  className = "",
  glow,
  allowOverflow = true,
}: Props) {
  return (
    <div
      className={[
        "relative rounded-2xl border border-amber-200/[0.18] bg-white/[0.04] backdrop-blur-xl",
        allowOverflow ? "overflow-visible" : "overflow-hidden",
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]",
        glow ? "shadow-glow-sm" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl opacity-[0.18]"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(234,179,8,0.5), transparent 55%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
