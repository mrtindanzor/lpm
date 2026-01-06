import type {
	ModaLWrapperProps,
	ModaLWrapperWithButtonProps,
} from "lpm/types/features/modal"
import FramerAnimatePosition from "lpm/ui/AnimatePosition"
import { cn } from "lpm/utils/cn"
import Modal from "./Modal"
import { ModalButton } from "./ModalButton"

export default function ModaLWrapper({
	close,
	children,
	className,
	variants,
	...props
}: ModaLWrapperProps) {
	return (
		<Modal close={close}>
			<FramerAnimatePosition
				variants={
					variants || {
						hidden: { y: "30%" },
					}
				}
				{...props}
				animate="show"
				exit="hidden"
				className={cn(
					"bg-muted outline outline-accent max-w-7xl rounded-t-2xl w-full h-fit absolute bottom-0 px-2 overflow-hidden mx-auto",
					className,
				)}
			>
				{children}
			</FramerAnimatePosition>
		</Modal>
	)
}

export function ModalWithButton({
	buttonProps,
	children,
	className,
	close,
	...props
}: ModaLWrapperWithButtonProps) {
	return (
		<ModaLWrapper
			{...props}
			close={close}
			className={cn(
				"flex flex-col gap-y-2.5 *:last:overflow-y-auto",
				className,
			)}
		>
			<ModalButton close={close} {...buttonProps} />

			{children}
		</ModaLWrapper>
	)
}
