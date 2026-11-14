import React from "react";
import { cn } from "./cn";

const variants = {
  neutral: "bg-surface-alt text-ink border border-line/60",
  accent: "bg-accent-soft text-accent-hover font-medium",
  success: "bg-emerald-50 text-success font-medium",
  danger: "bg-rose-50 text-danger font-medium",
  dark: "bg-ink text-white font-medium",
};

export default function Badge({ variant = "neutral", className, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium tracking-tight",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

