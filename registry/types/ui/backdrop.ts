import type { MotionProps } from "framer-motion";
import type { ComponentProps } from "react";

export type FullScreenBackropProps = MotionProps &
  ComponentProps<"div"> & {
    close: () => void;
    backdropClassName?: string;
  };
