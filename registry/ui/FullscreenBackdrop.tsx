"use client";
import { useEffect } from "react";
import { cn } from "lpm/utils/cn";
import type { FullScreenBackropProps } from "lpm/ui/backdrop";
import { useModal } from "lpm/ui/Modal/ModalProvider";
import FramerAnimatePosition from "lpm/ui/AnimatePosition";

export default function FullscreenBackdrop({
  className,
  children,
  ref,
  close,
  backdropClassName,
  ...props
}: FullScreenBackropProps) {
  const { setTotalOpenedModals } = useModal();

  useEffect(() => {
    setTotalOpenedModals((total) => total + 1);

    return () => {
      setTotalOpenedModals((total) => Math.max(0, total - 1));
    };
  }, [setTotalOpenedModals]);

  return (
    <FramerAnimatePosition
      ref={ref}
      {...props}
      animate="show"
      variants={{
        hidden: { opacity: 1 },
        show: { opacity: 1, transition: { when: undefined } },
      }}
      className={cn(
        "fixed! inset-x-0 bottom-0 @container overflow-hidden h-screen z-100 flex-place-center *:z-10",
        className,
      )}
    >
      <div
        aria-hidden
        onClick={close}
        title="Click to close modal"
        className={cn(
          "absolute modal-bg cursor-pointer inset-0 z-0! bg-gray-950/30 backdrop-blur",
          backdropClassName,
        )}
      />
      {children}
    </FramerAnimatePosition>
  );
}
