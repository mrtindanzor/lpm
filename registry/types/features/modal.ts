import type { FramerAnimatePositionProps } from "lpm/types/utils/framer-motion"
import type { ComponentProps } from "react"

export type ModalContextProps = {
	totalOpenedModals: number
	setTotalOpenedModals: React.Dispatch<React.SetStateAction<number>>
	modalRef: React.RefObject<HTMLDivElement | null>
} | null

export type ModalProps = {
	children: React.ReactNode
	id?: string
	close: () => void
}

export type ModalButtonProps = Pick<ModalProps, "close"> & {
	className?: string
	children?: React.ReactNode
}

export type ModaLWrapperProps = Omit<ComponentProps<"div">, "style"> &
	FramerAnimatePositionProps &
	ModalProps

export type ModaLWrapperWithButtonProps = ModaLWrapperProps & {
	buttonProps?: Omit<ModalButtonProps, "close">
}

export type ModaWithThumbProps = ModaLWrapperProps & {
	threshold?: number
}
