import type { FramerAnimatePositionProps } from "lpm/types/utils/framer-motion"
import type { ComponentProps } from "react"

export type ModalContextProps = {
	totalOpenedModals: number
	setTotalOpenedModals: React.Dispatch<React.SetStateAction<number>>
	modalRef: React.RefObject<HTMLDivElement | null>
} | null

export type ModalButtonProps = {
	className?: string
	close: () => void
	children?: React.ReactNode
}

export type ModaLWrapperProps = ComponentProps<"div"> &
	FramerAnimatePositionProps & {
		close: () => void
		children: React.ReactNode
	}
export type ModaLWrapperWithButtonProps = ModaLWrapperProps & {
	buttonProps?: Omit<ModalButtonProps, "close">
}

export type ModaWithThumbProps = ModaLWrapperProps & {
	threshold?: number
}
