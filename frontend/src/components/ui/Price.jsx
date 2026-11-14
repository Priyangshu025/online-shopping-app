import React from "react";
import { cn } from "./cn";

export default function Price({ value = 0, old = null, className, size = "md" }) {
  const numValue = Number(value) || 0;
  const numOld = old ? Number(old) : null;

  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg font-semibold",
    lg: "text-2xl sm:text-3xl font-semibold",
  };

  return (
    <div className={cn("inline-flex items-baseline gap-2", className)}>
      <span className={cn("text-ink tracking-tight", sizeClasses[size])}>
        ₹{numValue.toLocaleString("en-IN")}
      </span>
      {numOld && numOld > numValue && (
        <span className="text-sm font-normal text-ink-muted line-through">
          ₹{numOld.toLocaleString("en-IN")}
        </span>
      )}
    </div>
  );
}
