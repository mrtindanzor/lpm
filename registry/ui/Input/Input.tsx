import { cn } from "@lpm/utils/cn";
import type { ComponentProps } from "react";

export default function Input({
  className,
  ...props
}: ComponentProps<"input">) {
  return (
    <input
      {...props}
      className={cn(
        "py-2 focus-within:outline focus-within:outline-neutral flex w-full border rounded-md px-4",
        className,
      )}
    />
  );
}
