"use client"

import FullscreenBackdrop from "lpm/ui/FullscreenBackdrop"
import { cn } from "lpm/utils/cn"
import { type PropsWithChildren, useCallback, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { useModal } from "./ModalProvider"

const baseIndex = 3000

export default function Modal({
	children,
	close,
}: PropsWithChildren & { close: () => void }) {
	const initialisedRef = useRef(false)
	const { modalRef, totalOpenedModals, setTotalOpenedModals } = useModal()
	const modRef = useRef(0)

	const zIndex = modRef.current
	const isFirst = zIndex === baseIndex
	const isTopMost = zIndex === totalOpenedModals * baseIndex

	const handleEscape = useCallback(
		(e: KeyboardEvent) => {
			if (!isTopMost) return

			const exit = e.key === "Escape"
			if (exit) close()
		},
		[isTopMost, close],
	)

	useEffect(() => {
		if (initialisedRef.current) return

		setTotalOpenedModals((total) => {
			const newTotal = total + 1
			const zIndex = newTotal * baseIndex
			modRef.current = zIndex

			return newTotal
		})

		initialisedRef.current = true

		return () => {
			setTotalOpenedModals((total) => Math.max(0, total - 1))
			initialisedRef.current = false
		}
	}, [setTotalOpenedModals])

	useEffect(() => {
		window.addEventListener("keydown", handleEscape)

		return () => {
			window.addEventListener("keydown", handleEscape)
		}
	}, [handleEscape])

	if (!modalRef.current) return null

	return createPortal(
		<FullscreenBackdrop
			close={close}
			inert={!isTopMost}
			backdropClassName={cn(!isFirst && "bg-slate-50/5")}
			style={{ zIndex }}
		>
			{children}
		</FullscreenBackdrop>,
		modalRef.current,
	)
}
