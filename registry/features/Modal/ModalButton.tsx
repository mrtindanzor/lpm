import CloseButton from "lpm/ui/Buttons/CloseButton";
import type { ModalButtonProps } from "lpm/types/ui/modal";
import { cn } from "lpm/utils/cn";

export function ModalButton({ className, children, close }: ModalButtonProps) {
  return (
    <div
      className={cn("bg-muted py-2.5 flex justify-between w-full", className)}
    >
      {children}
      <CloseButton className="ml-auto" close={close} />
    </div>
  );
}
