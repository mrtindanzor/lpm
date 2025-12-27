"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export default function useScrollElement<T = HTMLDivElement>({
	rightLoop,
	leftLoop,
	itemsLength,
}: {
	rightLoop?: boolean
	leftLoop?: boolean
	itemsLength: number
}) {
	const ref = useRef<T>(null)
	const [currentIndex, setCurrentIndex] = useState(0)

	const setImage = useCallback(
		(behavior: "smooth" | "auto" = "auto") => {
			const slider = ref.current
			if (!(slider instanceof HTMLElement)) return

			const width = Number(slider.clientWidth) * currentIndex
			slider.scrollTo({ left: width, behavior })
		},
		[currentIndex],
	)

	const currentPosition = useCallback((position: "start" | "end") => {
		if (typeof window !== "undefined") {
			const slider = ref.current
			if (!(slider instanceof HTMLElement)) return

			if (position === "start") {
				const disabled = slider.scrollLeft === 0

				return disabled
			}

			if (position === "end") {
				const disabled =
					Math.ceil(slider.scrollLeft) + slider.clientWidth >=
					slider.scrollWidth

				return disabled
			}
		}
	}, [])

	const handleResize = useCallback(() => setImage("auto"), [setImage])

	useEffect(() => {
		//The position of the image image distorts when the container becomes smaller or larger, so we re adjust it manully, a set to auto, so use does not see it happen
		window.addEventListener("resize", handleResize)

		return () => {
			window.removeEventListener("resize", handleResize)
		}
	}, [handleResize])

	const scrollRight = useCallback(() => {
		if (typeof window !== "undefined") {
			const slider = ref.current
			if (!(slider instanceof HTMLElement)) return
			const width = slider.clientWidth

			if (currentPosition("end")) {
				if (rightLoop) {
					slider.scrollTo({ left: 0, behavior: "auto" })
					setCurrentIndex(0)
				}
			} else {
				slider.scrollBy({ left: width, behavior: "smooth" })
				setCurrentIndex((c) => c + 1)
			}
		}
	}, [currentPosition, rightLoop])

	const scrollLeft = useCallback(() => {
		if (typeof window !== "undefined") {
			const slider = ref.current
			if (!(slider instanceof HTMLElement)) return
			const width = slider.clientWidth

			if (!currentPosition("start")) {
				slider.scrollTo({
					left: slider.scrollLeft - width,
					behavior: "smooth",
				})
				setCurrentIndex((c) => c - 1)
			} else {
				if (leftLoop) {
					setCurrentIndex(itemsLength - 1)
					slider.scrollTo({
						left: slider.scrollWidth - width,
						behavior: "auto",
					})
				}
			}
		}
	}, [currentPosition, itemsLength, leftLoop])

	return {
		scrollLeft,
		scrollRight,
		currentPosition,
		currentIndex,
		ref,
	}
}
