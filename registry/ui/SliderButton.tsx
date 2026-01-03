import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { cn } from "lpm/utils/cn";
import type { ComponentProps } from "react";

export default function SliderButton({
  direction,
  disabled,
  className,
  ...props
}: { direction: "left" | "right" } & ComponentProps<"button">) {
  return (
    <button
      type="button"
      {...props}
      disabled={disabled}
      className={cn(
        disabled ? "*:bg-slate-950" : "*:bg-transparent",
        direction === "left" ? "left-1" : " right-1",
        "absolute z-3 *:rounded-full cursor-pointer *:aspect-square! px-1 hover:*:text-yellow-400 flex justify-center items-center *:size-9 inset-y-0 top-1/2 -translate-y-1/2",
        className,
      )}
    >
      {direction === "left" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
    </button>
  );
}
