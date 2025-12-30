import type { SpringOptions, TransformInputRange } from "framer-motion"
import type { RefObject } from "react"

type SupportedEdgeUnit = "px" | "vw" | "vh" | "%"
type EdgeUnit = `${number}${SupportedEdgeUnit}`
type NamedEdges = "start" | "end" | "center"
type EdgeString = NamedEdges | EdgeUnit | `${number}`
type Edge = EdgeString | number
type ProgressIntersection = [number, number]
type Intersection = `${Edge} ${Edge}`
type ScrollOffset = Array<Edge | Intersection | ProgressIntersection>

export type FramerScrollWrapperProps = {
	container?: RefObject<HTMLElement>
	target?: RefObject<HTMLElement>
	axis?: "x" | "y"
	offset?: ScrollOffset
	spring?: SpringOptions
	inputRange: TransformInputRange
	outputRange: unknown[]
}
