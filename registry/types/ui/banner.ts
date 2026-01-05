import type { ElementScrollProps } from "lpm/types/hooks/useScrollElement"
import type { ComponentProps } from "react"

export type CurrentSliderImageProps = {
	currentIndex: number
	total: number
} & ComponentProps<"div">

export type BannerImageProps = {
	url: string
	title: string
	content: string
}

export type BannerSliderProps = Omit<ImagesSliderProps, "images"> & {
	images: BannerImageProps[]
}

export type ImagesSliderProps = {
	images: { url: string }[]
	title: string
	_id: string
	hideImagesCount?: boolean
	hideSlider?: boolean
	imagesCountClassName?: string
	sliderButtonsClassName?: {
		className?: string
		right?: string
		left?: string
	}
} & Omit<ElementScrollProps, "itemsLength"> &
	ComponentProps<"div">

export type CarouselProps = {
	items: BannerImageProps[]
}
