"use client";

import { useCallback, useEffect, useRef } from "react";
import type { UseAutoHideProps } from "@lpm/types/hooks/useAutoHide";

export function useAutoHide<T>({
  setIsOpen,
  isOpen,
  event = ["mouseover", "click"],
}: UseAutoHideProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const refs = useRef<unknown[]>([]);

  const autoHide = useCallback(
    (e: Event) => {
      const el = e.target;
      const trackedRefs = refs.current;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      let isWithinBounds = false;

      trackedRefs.forEach((ref) => {
        if (!(el instanceof HTMLElement) || !(ref instanceof HTMLElement))
          return;

        if (ref.contains(el)) isWithinBounds = true;
      });

      if (!isWithinBounds)
        timeoutRef.current = setTimeout(() => setIsOpen(), 100);
    },
    [setIsOpen],
  );

  const captureRef = useCallback((index = 0) => {
    return (ref: T | null) => {
      refs.current[index] = ref;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    if (Array.isArray(event)) {
      event.forEach((e) => {
        window.addEventListener(e, autoHide);
      });
    } else window.addEventListener(event, autoHide);

    return () => {
      if (Array.isArray(event)) {
        event.forEach((e) => {
          window.removeEventListener(e, autoHide);
        });
      } else window.removeEventListener(event, autoHide);
    };
  }, [event, autoHide, isOpen]);

  return {
    captureRef,
  };
}
