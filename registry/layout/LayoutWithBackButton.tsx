import type { ArrowBackButtonProps } from "lpm/types/ui/button"
import { ArrowBackButton } from "lpm/ui/Buttons/BackButton"
import { cn } from "lpm/utils/cn"

export default function LayoutWithBackButton({
	children,
	className,
	...props
}: ArrowBackButtonProps) {
	return (
		<>
			<ArrowBackButton {...props} className={cn("mb-8", className)} />
			{children}
		</>
	)
}
