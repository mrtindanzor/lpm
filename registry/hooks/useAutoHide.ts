"use client"

import { useCallback, useEffect, useRef } from "react"

export function useAutoHide<T = HTMLElement>({
	setIsOpen,
	isOpen,
}: {
	isOpen: boolean
	setIsOpen: () => void
}) {
	const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)
	const ref = useRef<T>(null)

	const autoHide = useCallback(
		(e: Event) => {
			const el = e.target
			const trackedElement = ref.current

			if (timeoutRef.current) clearTimeout(timeoutRef.current)

			if (
				!(el instanceof HTMLElement) ||
				!(trackedElement instanceof HTMLElement)
			)
				return

			if (!trackedElement.contains(el))
				timeoutRef.current = setTimeout(() => setIsOpen(), 100)
		},
		[setIsOpen],
	)
	useEffect(() => {
		if (!isOpen) return

		window.addEventListener("click", autoHide)
		window.addEventListener("mouseover", autoHide)

		return () => {
			window.removeEventListener("click", autoHide)
			window.removeEventListener("mouseover", autoHide)
		}
	}, [autoHide, isOpen])

	return {
		ref,
	}
}
