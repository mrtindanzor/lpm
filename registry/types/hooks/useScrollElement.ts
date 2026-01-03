export type ElementScrollProps = {
	rightLoop?: boolean
	leftLoop?: boolean
	itemsLength: number
	autoScroll?: AutoScrollProps
}

export type AutoScrollProps = {
	intervalInSecs?: number
	direction?: "right" | "left"
	enabled?: boolean
}

export type PositionHistoryProps = {
	previous: number
	current: number
}
