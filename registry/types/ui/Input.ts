import type { ComponentProps } from "react";

export type FInputProps = {
  label: string;
  inputClassName?: string;
  labelClassName?: string;
} & ComponentProps<"input">;
