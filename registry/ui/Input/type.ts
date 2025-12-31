import type { ComponentProps } from "react";

export type FInputProps = {
  icon?: React.ElementType;
  label: string;
  inputClassName?: string;
  labelClassName?: string;
} & ComponentProps<"input">;
