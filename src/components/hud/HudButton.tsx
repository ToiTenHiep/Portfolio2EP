"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type HudButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  active?: boolean;
};

export default function HudButton({
  children,
  active = false,
  className = "",
  ...props
}: HudButtonProps) {
  return (
    <button
      type="button"
      {...props}
      className={[
        "relative h-10 overflow-hidden border px-4 text-[12px] font-black uppercase tracking-[0.18em] transition duration-200",
        "before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.2),transparent)] before:opacity-0 before:transition",
        "hover:before:opacity-100",
        active
          ? "border-[#00fff0] bg-[#00fff0]/10 text-[#00fff0] shadow-[0_0_18px_rgba(0,255,240,0.55),inset_0_0_18px_rgba(0,255,240,0.16)]"
          : "border-[#ff005d] bg-[#ff005d]/5 text-[#ff005d] shadow-[0_0_12px_rgba(255,0,93,0.25)] hover:border-[#00fff0] hover:text-[#00fff0] hover:shadow-[0_0_18px_rgba(0,255,240,0.4)]",
        className,
      ].join(" ")}
    >
      <span className="relative z-10">{children}</span>

      {active && (
        <span className="pointer-events-none absolute inset-x-2 bottom-0 h-[2px] bg-[#00fff0] shadow-[0_0_12px_rgba(0,255,240,0.95)]" />
      )}
    </button>
  );
}