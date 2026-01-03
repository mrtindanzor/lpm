import type { StyledLinkProps } from "lpm/types/ui/button";
import Link from "next/link";
import { ButtonVariants } from "./Button";

export default function StyledLink({
  variant,
  outline,
  className,
  hover,
  hoverEffect,
  effectTiming,
  ...props
}: StyledLinkProps) {
  return (
    <Link
      {...props}
      className={ButtonVariants({
        variant,
        outline,
        className,
        hover,
        hoverEffect,
        effectTiming,
      })}
    />
  );
}
