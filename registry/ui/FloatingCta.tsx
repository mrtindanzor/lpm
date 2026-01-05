"use client"

import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline"
import { AnimatePresence } from "framer-motion"
import { useAutoHide } from "lpm/hooks/useAutoHide"
import type { ButtonProps, StyledLinkProps } from "lpm/types/ui/button"
import type {
	CtaCardProps,
	CtaItemProps,
	FloatingCtaProps,
} from "lpm/types/ui/FloatingCta"
import Button from "lpm/ui/Buttons/Button"
import StyledLink from "lpm/ui/Buttons/Link"
import FramerAnimatePosition from "lpm/ui/Framer/AnimatePosition"
import { cn } from "lpm/utils/cn"
import { useState } from "react"

export const CTA_lIST: CtaItemProps[] = []

export default function FloatingCta({ className, ...props }: FloatingCtaProps) {
	const [isOpen, setIsOpen] = useState(false)
	const { captureRef } = useAutoHide({
		setIsOpen: () => setIsOpen(false),
		isOpen,
		event: "click",
	})

	return (
		<div
			{...props}
			className={cn(
				"pointer-events-none fixed bottom-10 inset-x-0 z-40",
				className,
			)}
		>
			<div className="max-w-6xl pointer-events-none group/cta pr-6  mx-auto flex justify-end">
				<Button
					className="rounded-full! pointer-events-auto aspect-square p-3!"
					variant="gold"
					hover="bright"
					hoverEffect="from-bottom"
					onClick={() => setIsOpen((o) => !o)}
					ref={captureRef(1)}
				>
					<ChatBubbleLeftEllipsisIcon className="size-8 text-neutral group-hover/cta:text-accent" />
				</Button>

				<AnimatePresence>
					{isOpen && (
						<FramerAnimatePosition
							ref={captureRef()}
							animate="show"
							exit="hidden"
							variants={{
								hidden: { scale: 0 },
								show: { scale: 1 },
							}}
							className="absolute drop-shadow pointer-events-auto z-41 bottom-[calc(100%+4px)] "
						>
							<section className="px-2 py-2 bg-muted-secondary rounded-xl">
								<h3 className="px-2 text-2xl mb-2 sm:text-3xl">Contact Me</h3>

								<ul>
									{CTA_lIST.map((link) => (
										<CtaItem key={link.title} {...link} />
									))}
								</ul>
							</section>
						</FramerAnimatePosition>
					)}
				</AnimatePresence>
			</div>
		</div>
	)
}

function CtaItem({
	title,
	link,
	takeAction,
	className,
	hover = "bright",
	hoverEffect = "from-bottom",
	iconClassName,
	icon: Slot,
	...props
}: CtaCardProps) {
	const Icon = () => (
		<Slot className={cn("size-5 rounded-full", iconClassName)} />
	)
	const Text = () => <span className="inline-block mb-1.5">{title}</span>

	return (
		<li
			className={cn(
				"*:justify-start! *:text-lg sm:*:text-xl  *:px-2 w-[clamp(5rem,80vw,15rem)] group/card",
				className,
			)}
		>
			{link && (
				<StyledLink
					{...{ hover, hoverEffect, ...(props as StyledLinkProps) }}
					variant="none"
					href={link}
				>
					<Icon />
					<Text />
				</StyledLink>
			)}

			{takeAction && (
				<Button
					{...{ hover, hoverEffect, ...(props as ButtonProps) }}
					variant="none"
				>
					<Icon />
					<Text />
				</Button>
			)}
		</li>
	)
}
