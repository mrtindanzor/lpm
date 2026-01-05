import type { CarouselProps } from "lpm/types/ui/banner"
import BannerSlider from "lpm/ui/Carousel/BannerSlider"

export default function Carousel({ items }: CarouselProps) {
	return (
		<div className="max-w-full relative overflow-x-hidden">
			<BannerSlider images={items} _id="carousel" title="Carousel" hideSlider />
		</div>
	)
}
