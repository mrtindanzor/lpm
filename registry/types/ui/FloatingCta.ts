import type { ComponentProps } from "react";
import type { ButtonProps, StyledLinkProps } from "@lpm/types/ui/button";

export type CtaItemProps = {
  iconClassName?: string;
  icon: React.ElementType;
  title: string;
  link?: string;
  takeAction?: () => void;
};

export type FloatingCtaProps = ComponentProps<"div">;

export type CtaCardProps = CtaItemProps & (ButtonProps | StyledLinkProps);
