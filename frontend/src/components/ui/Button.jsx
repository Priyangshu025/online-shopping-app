import React from "react";
import { cn } from "./cn";

const variants = {
  primary: "bg-accent text-white hover:bg-accent-hover shadow-sm",
  secondary: "border border-line text-ink bg-white hover:bg-surface-alt",
  outline: "border border-accent text-accent hover:bg-accent-soft hover:text-accent-hover",
  ghost: "text-accent hover:underline px-0 py-0",
  danger: "bg-danger text-white hover:bg-danger/90",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-3.5 text-base font-semibold",
};

export default function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition duration-150",
        "active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
