import { cn } from "lpm/utils/cn";
import type { ComponentProps } from "react";

export default function Textarea({
  className,
  ...props
}: ComponentProps<"textarea">) {
  return (
    <textarea
      {...props}
      className={cn(
        "py-2 focus-within:outline focus-within:outline-neutral flex w-full border rounded-md px-4",
        className,
      )}
    />
  );
}
