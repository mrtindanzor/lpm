"use client"

import FullscreenBackdrop from "lpm/ui/FullscreenBackdrop"
import { cn } from "lpm/utils/cn"
import { type PropsWithChildren, useRef } from "react"
import { createPortal } from "react-dom"
import { useModal } from "./ModalProvider"

export default function Modal({
	children,
	close,
}: PropsWithChildren & { close: () => void }) {
	const { modalRef, totalOpenedModals } = useModal()
	const modalzIndexRef = useRef(totalOpenedModals + 1)

	if (!modalRef.current) return null

	return createPortal(
		<FullscreenBackdrop
			close={close}
			inert={modalzIndexRef.current !== totalOpenedModals}
			backdropClassName={cn(
				modalzIndexRef.current !== 1 ? "bg-slate-50/5" : "",
			)}
			className={cn(
				modalzIndexRef.current !== totalOpenedModals ? "z-10!" : "",
			)}
		>
			{children}
		</FullscreenBackdrop>,
		modalRef.current,
	)
}
