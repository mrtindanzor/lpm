export type TabSelectorProps<T> = {
	selected: T
	setValue: (value: T) => void
	options: readonly T[]
	label?: string
}
