"use client";

import { X } from "lucide-react";
import Button from "./Button";
import type { CloseButtonProps } from "lpm/types/ui/button";
import { cn } from "lpm/utils/cn";

export default function CloseButton({
  close,
  className,
  ...props
}: CloseButtonProps) {
  return (
    <Button
      {...props}
      onClick={close}
      onKeyDown={(e) => e.key === "Enter" && close()}
      variant="dangerOutline"
      className={cn(
        "rounded-full opacity-50 flex hover:opacity-80 outline-none p-1.5 *:size-6",
        className,
      )}
    >
      <X />
    </Button>
  );
}
