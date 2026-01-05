"use client";

import useScrollElement from "lpm/hooks/useScrollElement";
import type {
  CurrentSliderImageProps,
  ImagesSliderProps,
} from "lpm/types/ui/banner";
import MImage from "../Image";
import { cn } from "lpm/utils/cn";
import SliderButton from "../SliderButton";

export default function ImagesSlider({
  images,
  className,
  title,
  imagesCountClassName,
  hideImagesCount,
  autoScroll,
  leftLoop,
  rightLoop,
  sliderButtonsClassName,
  hideSlider = false,
  ...props
}: ImagesSliderProps) {
  const { ref, scrollLeft, scrollRight, currentIndex } =
    useScrollElement<HTMLUListElement>({
      itemsLength: images.length,
      autoScroll,
      rightLoop,
      leftLoop,
    });

  return (
    <div {...props} className={cn("relative w-full", className)}>
      <ul
        ref={ref}
        className="grid grid-flow-col size-full [&::-webkit-scrollbar]:hidden overflow-x-auto snap-mandatory snap-x auto-cols-[100%]"
      >
        {images.map((image) => (
          <li key={image.url}>
            <MImage url={image.url} title={title} className="z-1 size-full" />
          </li>
        ))}
      </ul>
      {!hideImagesCount && !hideSlider && images.length > 1 && (
        <CurrentImage
          total={images.length}
          currentIndex={currentIndex + 1}
          className={cn("z-3 select-none", imagesCountClassName)}
        />
      )}

      {images.length > 1 && !hideSlider && (
        <>
          <SliderButton
            direction="left"
            disabled={!leftLoop && currentIndex === 0}
            className={cn(
              "*:size-6 sm:*:size-7",
              sliderButtonsClassName?.className,
              sliderButtonsClassName?.left,
            )}
            onClick={scrollLeft}
          />
          <SliderButton
            direction="right"
            disabled={!rightLoop && currentIndex + 1 === images.length}
            className={cn(
              "*:size-6 sm:*:size-7",
              sliderButtonsClassName?.className,
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
      className={cn(
        "absolute bottom-2 right-5 py-2 tracking-wider px-5 rounded-md bg-slate-950/80 text-white",
        className,
      )}
    >
      {currentIndex}/{total}
    </div>
  );
}
