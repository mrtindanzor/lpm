import { cn } from "@lpm/utils/cn";
import Input from "./Input";
import type { FInputProps } from "./type";

export default function FInput({
  id,
  label,
  className,
  icon: Icon,
  inputClassName,
  labelClassName,
  ...rest
}: FInputProps) {
  return (
    <div className={cn("relative group overflow-hidden", className)}>
      <label
        htmlFor={id}
        className={cn("text-base font-medium", labelClassName)}
      >
        {label}
      </label>
      <Input
        id={id}
        {...rest}
        className={cn(Icon ? "py-2.5 pl-12 " : "", inputClassName)}
      />
    </div>
  );
}
