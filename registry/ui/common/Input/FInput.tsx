"use client";

import { cn } from "@lpm/utils/cn";
import { useId } from "react";
import Input from "./Input";
import type { FInputProps } from "@lpm/types/ui/Input";

export default function FInput({
  label,
  className,
  inputClassName,
  labelClassName,
  ...rest
}: FInputProps) {
  const id = useId();

  return (
    <div className={cn("relative group overflow-hidden", className)}>
      <label
        htmlFor={id}
        className={cn("text-base font-medium", labelClassName)}
      >
        {label}
      </label>
      <Input id={id} {...rest} className={cn(inputClassName)} />
    </div>
  );
}
