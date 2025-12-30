"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ElementScrollProps, PositionHistoryProps } from "./type";

export default function useScrollElement<T extends HTMLElement>({
  rightLoop,
  leftLoop,
  itemsLength,
  autoScroll,
}: ElementScrollProps) {
  const intervalIdRef = useRef<ReturnType<typeof setInterval>>(null);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout>>(null);
  const directionRef = useRef<"right" | "left">("right");
  const ref = useRef<T>(null);
  const manuallyControlledRef = useRef(false);
  const autoControlledRef = useRef(true);
  const scrollHistory = useRef<PositionHistoryProps>({
    previous: 0,
    current: 0,
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  const setImage = useCallback(
    (behavior: "smooth" | "auto" = "auto") => {
      const slider = ref.current;
      if (!(slider instanceof HTMLElement)) return;

      const width = Number(slider.clientWidth) * currentIndex;
      slider.scrollTo({ left: width, behavior });
    },
    [currentIndex],
  );

  const handleResize = useCallback(() => setImage("auto"), [setImage]);

  const scrollRight = useCallback(
    (auto?: boolean) => {
      directionRef.current = "right";
      setCurrentIndex((index) => {
        if (index + 1 < itemsLength) return index + 1;

        return auto || rightLoop ? 0 : index;
      });
    },
    [itemsLength, rightLoop],
  );

  const scrollLeft = useCallback(
    (auto?: boolean) => {
      directionRef.current = "left";
      setCurrentIndex((index) => {
        if ((auto || leftLoop) && index === 0) return itemsLength - 1;

        return Math.max(0, index - 1);
      });
    },
    [itemsLength, leftLoop],
  );

  const handleAutoScroll = useCallback(() => {
    if (manuallyControlledRef.current) return null;
    autoControlledRef.current = true;

    const { direction = "right", intervalInSecs = 6 } = autoScroll || {};

    return setInterval(() => {
      if (direction === "right") return scrollRight(true);
      scrollLeft(true);
    }, intervalInSecs * 1000);
  }, [scrollLeft, autoScroll, scrollRight]);

  const scrollManually = useCallback(
    (direction: "left" | "right") => {
      const scrollEffects = () => {
        autoControlledRef.current = false;
        manuallyControlledRef.current = true;

        const intervalId = intervalIdRef.current;
        const timeoutId = timeoutIdRef.current;
        if (intervalId) clearInterval(intervalId);
        if (timeoutId) clearTimeout(timeoutId);

        const {
          direction: autoScrollDirection = "right",
          intervalInSecs = 6,
          enabled = false,
        } = autoScroll || {};

        if (enabled)
          timeoutIdRef.current = setTimeout(() => {
            manuallyControlledRef.current = false;
            intervalIdRef.current = handleAutoScroll();
            if (autoScrollDirection === "right") return scrollRight(true);
            scrollLeft(true);
          }, intervalInSecs * 1000);
      };

      if (direction === "right")
        return () => {
          scrollEffects();
          scrollRight();
        };

      return () => {
        scrollEffects();
        scrollLeft();
      };
    },
    [scrollRight, autoScroll, handleAutoScroll, scrollLeft],
  );

  const handlScrollEvent = useCallback(
    (e: Event) => {
      if (manuallyControlledRef.current || autoControlledRef.current) {
        manuallyControlledRef.current = false;
        autoControlledRef.current = false;
        return;
      }

      if (!(e.target instanceof HTMLElement)) return;
      const slider = e.target;

      const { current, previous } = scrollHistory.current;

      setCurrentIndex((index) => {
        if (slider.scrollLeft < slider.clientWidth) return 0;

        if (previous > current) return Math.max(0, index - 1);
        if (index + 1 > itemsLength) return 0;

        return index + 1;
      });
    },
    [itemsLength],
  );

  useEffect(() => {
    //The position of the image image distorts when the container becomes smaller or larger, so we re adjust it manully, a set to auto, so use does not see it happen
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    const intervalId = intervalIdRef.current;

    const slider = ref.current;
    if (!slider) return;

    const { enabled = false } = autoScroll || {};

    if (!enabled) return;

    if (intervalId) clearInterval(intervalId);
    intervalIdRef.current = handleAutoScroll();
    slider.addEventListener("scrollend", handlScrollEvent);

    return () => {
      if (intervalId) clearInterval(intervalId);
      slider.removeEventListener("scrollend", handlScrollEvent);
    };
  }, [autoScroll, handleAutoScroll, handlScrollEvent]);

  useEffect(() => {
    const slider = ref.current;
    if (!slider) return;

    const position = currentIndex * slider.clientWidth;
    const behaviour = () => {
      switch (directionRef.current) {
        case "left":
          return currentIndex === itemsLength - 1 ? "auto" : "smooth";

        case "right":
          return currentIndex < 1 ? "auto" : "smooth";
      }
    };

    slider.scrollTo({
      left: position,
      behavior: behaviour(),
    });
  }, [currentIndex, itemsLength]);

  return {
    scrollLeft: scrollManually("left"),
    scrollRight: scrollManually("right"),
    currentIndex,
    ref,
  };
}
