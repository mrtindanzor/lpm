"use client";
import type { FramerAnimatePositionProps } from "lpm/types/utils/framer-motion";
import { motionVariants } from "lpm/utils/motion";
import { motion } from "framer-motion";
import { useMemo } from "react";

export default function FramerAnimatePosition({
  variants,
  exit = "exit",
  ...props
}: FramerAnimatePositionProps) {
  const updatedVariants = useMemo(() => {
    const animatePosition = motionVariants({
      hidden: { ...(variants?.hidden ? {} : { x: -50 }) },
    });
    return {
      hidden: { ...animatePosition.hidden, ...variants?.hidden },
      show: { ...animatePosition.show, ...variants?.show },
      exit: { ...animatePosition.exit, ...variants?.exit },
    };
  }, [variants]);

  return (
    <motion.div
      variants={updatedVariants}
      initial="hidden"
      exit={exit}
      viewport={{ once: true }}
      {...props}
    />
  );
}
