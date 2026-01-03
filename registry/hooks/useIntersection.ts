"use client";
import type { UseIntersectionProps } from "lpm/types/hooks/useIntersection";
import { useEffect, useRef, useState } from "react";

export default function useIntersection<T = HTMLDivElement>({
  threshold = 0.5,
  rootMargin = "0px",
  unobserve,
}: UseIntersectionProps = {}) {
  const ref = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef || !(currentRef instanceof HTMLElement)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && unobserve) observer.unobserve(entry.target);
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(currentRef);

    return () => observer.disconnect();
  }, [threshold, rootMargin, unobserve]);

  return {
    isIntersecting,
    ref,
  };
}
