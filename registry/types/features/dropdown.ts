import type { ButtonVariantTypes } from "lpm/types/ui/button";
import type { ComponentProps } from "react";

export type DropDownItem<T> = {
  readonly icon?: React.ElementType;
  readonly value: T;
  readonly title: string;
  readonly className?: string;
} & ButtonVariantTypes;

export type DropDownProps<T> = {
  Icon?: React.ElementType;
  title?: string;
  setValue: (value: T, index?: number) => void;
  items: readonly DropDownItem<T>[];
} & ButtonVariantTypes &
  ComponentProps<"div">;

export type DropDownListProps<T> = Pick<
  DropDownProps<T>,
  "items" | "setValue"
> & {
  ref: React.RefObject<{
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isOpen: boolean;
  } | null>;
};

export type DropDownItemProps<T> = DropDownItem<T> &
  Pick<DropDownProps<T>, "setValue"> & {
    setIsOpen: (value: boolean) => void;
  };
