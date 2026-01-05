"use client";

import useScrollElement from "lpm/hooks/useScrollElement";
import type {
  BannerImageProps,
  BannerSliderProps,
  CurrentSliderImageProps,
} from "lpm/types/ui/banner";
import MImage from "../Image";
import SliderButton from "lpm/ui/SliderButton";
import { cn } from "lpm/utils/cn";

export default function BannerSlider({
  images,
  className,
  title,
  imagesCountClassName,
  hideImagesCount,
  autoScroll,
  leftLoop,
  rightLoop,
  hideSlider,
  sliderButtonsClassName,
  ...props
}: BannerSliderProps) {
  const { ref, scrollLeft, scrollRight, currentIndex } =
    useScrollElement<HTMLUListElement>({
      itemsLength: images.length,
      autoScroll: {
        enabled: true,
        intervalInSecs: 8,
      },
      rightLoop: true,
      leftLoop: true,
    });

  return (
    <div
      {...props}
      className={cn("relative w-full h-80 sm:h-120 max-w-screen", className)}
    >
      <ul
        ref={ref}
        className="grid bg-slate-950 grid-flow-col size-full [&::-webkit-scrollbar]:hidden overflow-x-auto snap-mandatory snap-x auto-cols-[100%]"
      >
        {images.map((image) => (
          <Banner {...image} key={image.url} />
        ))}
      </ul>
      {!hideImagesCount && (
        <CurrentImage
          total={images.length}
          currentIndex={currentIndex + 1}
          className={cn("z-3", imagesCountClassName)}
        />
      )}

      {!hideSlider && (
        <>
          <SliderButton
            direction="left"
            className={cn(
              "*:size-6 sm:*:size-7",
              "*:bg-transparent *:border-none *:text-white hover:*:text-yellow-400 hover:*:bg-transparent hover:*:size-8",
              sliderButtonsClassName?.left,
            )}
            onClick={scrollLeft}
          />
          <SliderButton
            direction="right"
            className={cn(
              "*:size-6 sm:*:size-7",
              "*:bg-transparent *:border-none *:text-white hover:*:text-yellow-400 hover:*:bg-transparent hover:*:size-8",
              sliderButtonsClassName?.right,
            )}
            onClick={scrollRight}
          />
        </>
      )}
    </div>
  );
}

function CurrentImage({
  currentIndex,
  total,
  className,
  ...props
}: CurrentSliderImageProps) {
  return (
    <div
      {...props}
      className={cn("absolute bottom-2 right-5 flex gap-1.5", className)}
    >
      {Array.from({ length: total }).map((_, index) => (
        <span
          //biome-ignore lint/suspicious/noArrayIndexKey: reason static images do not change
          key={index}
          className={cn(
            "block rounded-full size-2",
            index + 1 === currentIndex ? "bg-white" : "bg-gray-600",
          )}
        />
      ))}
    </div>
  );
}

function Banner({ ...props }: BannerImageProps) {
  return (
    <li className="relative py-8  size-full">
      <MImage {...props} className="z-1 h-full" />
      <BannerContent {...props} />
    </li>
  );
}

function BannerContent({
  title,
  content,
}: Pick<BannerImageProps, "content" | "title">) {
  return (
    <div className="absolute inset-0 flex gap-y-4 justify-end px-10 md:px-18 pb-8 flex-col z-2">
      <h2 className="text-2xl bg-black w-fit px-4 py-1.5 md:text-3xl uppercase font-semibold font-chakra text-white -rotate-4 mb-2">
        {title}
      </h2>
      <p className="line-clamp-4 max-w-8/10 md:text-lg first-letter:uppercase">
        {content}
      </p>
    </div>
  );
}
