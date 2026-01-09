"use client";

import { useMotionValue } from "framer-motion";
import type { ModaWithThumbProps } from "lpm/types/features/modal";
import { cn } from "lpm/utils/cn";
import { useCallback } from "react";
import ModaLWrapper from "./ModalWrapper";

const OFFSET_TOP = 60;

export default function ModalWithThumb({
	children,
	style,
	close,
	threshold,
	className,
	...props
}: ModaWithThumbProps) {
	const ytranslate = useMotionValue(0);
	const handleDrag = useCallback(() => {
		const top = ytranslate.get();
		if (top > (threshold ?? OFFSET_TOP)) close();
	}, [ytranslate, threshold, close]);

	return (
		<ModaLWrapper
			{...props}
			drag="y"
			dragConstraints={{
				top: 0,
				bottom: 0,
			}}
			dragElastic={{
				top: 0,
				bottom: 0.4,
			}}
			style={{
				y: ytranslate,
				...style,
			}}
			close={close}
			onDragEnd={handleDrag}
			className={cn(
				"pt-4 h-[90vh] grid gap-y- grid-rows-[auto_1fr]",
				className,
			)}
		>
			<Thumb />
			<div className="overflow-y-auto">{children}</div>
		</ModaLWrapper>
	);
}

function Thumb() {
	return (
		<div className="h-1.5 mb-2 w-[clamp(4rem,calc(20vw+0.1rem),8rem)] cursor-grab active:cursor-grabbing bg-accent rounded-2xl mx-auto" />
	);
}
