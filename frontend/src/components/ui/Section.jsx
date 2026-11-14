import React from "react";
import { cn } from "./cn";

export default function Section({
  alt = false,
  className,
  containerClassName,
  children,
  id,
  ...props
}) {
  return (
    <section
      id={id}
      className={cn(
        "section w-full transition-colors",
        alt ? "bg-surface-alt" : "bg-surface",
        className
      )}
      {...props}
    >
      <div className={cn("container-page", containerClassName)}>
        {children}
      </div>
    </section>
  );
}

