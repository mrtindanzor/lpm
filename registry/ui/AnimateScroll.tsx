"use client"

import { motion } from "framer-motion"
import useFramerScroll from "lpm/hooks/useFramerScroll"
import type { FramerAnimateScrollProps } from "lpm/types/utils/framer-motion"

export default function AnimateScroll({
	style,
	styleKey,
	offset,
	inputRange,
	outputRange,
	spring,
	container,
	target,
	axis,
	...props
}: FramerAnimateScrollProps) {
	const { ref, motionValue } = useFramerScroll({
		offset,
		inputRange,
		outputRange,
		spring,
		container,
		target,
		axis,
	})

	return (
		<motion.div
			{...props}
			style={{ ...style, [styleKey]: motionValue }}
			ref={ref}
		/>
	)
}
