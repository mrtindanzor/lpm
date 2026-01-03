import type { ComponentProps } from "react"

export type FTextareaProps = {
	icon?: React.ElementType
	label: string
	inputClassName?: string
	labelClassName?: string
} & ComponentProps<"textarea">
