import type { ComponentProps } from "react"

export type TabSelectorProps<T> = {
	selected: T
	setValue: (value: T) => void
	options: readonly { title: T; tip?: string }[]
	label?: string
} & ComponentProps<"div">
