"use client";

import type { FTextareaProps } from "lpm/types/ui/Textarea";
import { cn } from "lpm/utils/cn";
import { useId } from "react";
import Textarea from "./Textarea";

export default function FTextarea({
  label,
  className,
  textClassName,
  labelClassName,
  ...rest
}: FTextareaProps) {
  const id = useId();

  return (
    <div className={cn("relative group overflow-hidden", className)}>
      <label
        htmlFor={id}
        className={cn("text-base font-medium", labelClassName)}
      >
        {label}
      </label>

      <Textarea id={id} {...rest} className={cn(textClassName)} />
    </div>
  );
}
