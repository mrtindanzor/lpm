import type { ComponentProps } from "react"

export type MyImageProps = {
	url: string
	title: string
} & ComponentProps<"div">
