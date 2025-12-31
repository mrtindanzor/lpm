import { cn } from "@lpm/utils/cn"
import { ImageIcon } from "lucide-react"
import Image from "next/image"
import type { ComponentProps } from "react"

export default function MyImage({
	title,
	url,
	className,
	children,
	...props
}: { url: string; title: string } & ComponentProps<"div">) {
	return (
		<div
			{...props}
			className={cn(
				"relative w-full h-full",
				!url ? "bg-gray-100 rounded" : "",
				className,
			)}
		>
			{!url && (
				<ImageIcon className="size-full absolute object-contain left-1/2 top-1/2 -translate-1/2 opacity-5 stroke-1" />
			)}

			{url && (
				<Image
					alt={title}
					sizes="100%"
					fill
					src={url}
					className="z-1 object-contain"
				/>
			)}
			{children}
		</div>
	)
}
