import type { ButtonProps } from "lpm/types/ui/button";
import { cva } from "class-variance-authority";

export const ButtonVariants = cva(
  "relative link  hover-effect py-1.5 flex-place-center  px-4 transition duration-300 ease-in-out",
  {
    variants: {
      variant: {
        gold: "bg-yellow-500 text-muted gap-2 py-1 px-6 rounded-xl border hover:bg-accent",
        dark: "bg-muted text-gray-200 gap-2 py-1 px-6 rounded-xl border",
        none: "bg-transparent gap-2 py-1 px-6 rounded-xl",
      },
      outline: {
        gold: "border-3 outline outline-accent",
      },
      hover: {
        gold: "hover:after:bg-accent hover:text-muted",
        bright: "hover:border-neutral hover:after:bg-gray-100 hover:text-muted",
        dark: "hover:border-muted hover:after:bg-muted hover:text-neutral",
      },
      hoverEffect: {
        "from-top": "hover:after:animate-flow-effect from-top-effect",
        "from-bottom": "hover:after:animate-flow-effect from-bottom-effect",
        "from-left": "hover:after:animate-flow-effect from-left-effect",
        "from-right": "hover:after:animate-flow-effect from-right-effect",
      },
      effectTiming: {
        slow: "effect-slow",
        fast: "effect-fast",
        normal: "effect-normal",
      },
    },
    defaultVariants: {
      variant: "dark",
      effectTiming: "normal",
    },
  },
);

export default function Button({
  className,
  variant,
  outline,
  hover,
  hoverEffect,
  effectTiming,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={ButtonVariants({
        className,
        variant,
        hover,
        hoverEffect,
        effectTiming,
        outline,
      })}
    />
  );
}
