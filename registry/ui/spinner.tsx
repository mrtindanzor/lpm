import type { ComponentProps } from "react";
import { cn } from "@lpm/utils/cn";

export default function Spinner({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "border-3 z-10 !easeIn border-sky-600 border-b-transparent size-10 rounded-full animate-spin",
        className,
      )}
    ></div>
  );
}
