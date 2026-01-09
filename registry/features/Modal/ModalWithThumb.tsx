"use client"

import { useAnimate, useMotionValue } from "framer-motion"
import type { ModaWithThumbProps } from "lpm/types/features/modal"
import { cn } from "lpm/utils/cn"
import { useCallback, useId } from "react"
import ModaLWrapper from "./ModalWrapper"

const OFFSET_TOP = 70

export default function ModalWithThumb({
	children,
	style,
	close,
	threshold,
	className,
	...props
}: ModaWithThumbProps) {
	const genId = useId()
	const id = `id${genId}id`

	const [scope, animate] = useAnimate<HTMLDivElement>()
	const ytranslate = useMotionValue(0)

	const handleClose = useCallback(async () => {
		const y = ytranslate.get()
		const start = typeof y === "string" ? 0 : y

		if (start < (threshold ?? OFFSET_TOP)) return

		const node = scope.current
		const backdrop = document.getElementById(id)
		if (!(node instanceof HTMLElement) || !(backdrop instanceof HTMLElement))
			return

		const { offsetHeight } = node

		animate(backdrop, { opacity: [1, 0] })

		await animate(scope.current, {
			y: [start, offsetHeight],
		})
		close()
	}, [animate, id, scope, threshold, ytranslate, close])

	return (
		<ModaLWrapper
			variants={{
				hidden: { y: "100%" },
				show: {
					transition: {
						type: "spring",
						stiffness: 30,
						ease: "easeInOut",
						duration: 0.1,
					},
				},
			}}
			animate="show"
			{...props}
			id={id}
			drag="y"
			ref={scope}
			dragConstraints={{
				top: 0,
				bottom: 0,
			}}
			dragElastic={{
				top: 0,
				bottom: 0.6,
			}}
			style={{
				y: ytranslate,
				...style,
			}}
			close={handleClose}
			onDragEnd={handleClose}
			className={cn(
				"pt-4 h-[90vh] grid gap-y- grid-rows-[auto_1fr]",
				className,
			)}
		>
			<Thumb />
			<div className="overflow-y-auto">{children}</div>
		</ModaLWrapper>
	)
}

function Thumb() {
	return (
		<div className="h-1.5 mb-2 w-[clamp(4rem,calc(20vw+0.1rem),8rem)] cursor-grab active:cursor-grabbing bg-accent rounded-2xl mx-auto" />
	)
}
