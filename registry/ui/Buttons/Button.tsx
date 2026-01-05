import { cva } from "class-variance-authority"
import type { ButtonProps } from "lpm/types/ui/button"

export const ButtonVariants = cva(
	"relative link  hover-effect py-1.5 flex-place-center  rounded-xl px-4 transition duration-300 ease-in-out",
	{
		variants: {
			variant: {
				gold: "bg-yellow-500 text-muted gap-2 py-1 px-6 border hover:bg-accent",
				dark: "bg-muted text-gray-200 gap-2 py-1 px-6 border",
				bright: "border border-neutral bg-neutral text-muted",
				brightAccent: "outline-2 outline-accent bg-neutral text-muted",
				default: "bg-sky-600 hover:bg-sky-500 text-white",
				white: "bg-white hover:bg-gray-200 outline-0",
				outline: "bg-white hover:bg-sky-100 text-sky-600 outline-sky-300",
				ghost:
					"bg-transparent hover:bg-gray-100 outline-0 hover:outline hover:outline-gray-200",
				muted:
					"bg-muted hover:bg-gray-100 outline-1 hover:outline hover:outline-gray-200",
				accent: " bg-accent border-accent text-muted",
				success: "bg-green-600 hover:bg-green-400 text-white",
				successOutline:
					"bg-white hover:bg-green-100 text-green-600 outline-green-300",
				danger: "bg-rose-600 hover:bg-rose-500 text-white",
				dangerOutline: "outline text-rose-600 outline-rose-600",
				glass:
					"bg-neutral/10 hover:bg-white/20 backrop-blur-xl text-white outline-gray-800/30",
				link: "py-0.5 px-1 underline underline-offset-2 text-sky-600 outline-none",
				none: "bg-transparent gap-2 py-1 px-6",
			},
			outline: {
				gold: "border-3 outline outline-accent",
			},
			hover: {
				gold: "hover:after:bg-accent hover:text-muted",
				bright: "hover:border-neutral hover:after:bg-neutral hover:text-muted",
				dark: "hover:border-muted hover:after:bg-muted hover:text-neutral",
			},
			hoverEffect: {
				"from-top": "hover:after:animate-flow-effect from-top-effect",
				"from-bottom": "hover:after:animate-flow-effect from-bottom-effect",
				"from-left": "hover:after:animate-flow-effect from-left-effect",
				"from-right": "hover:after:animate-flow-effect from-right-effect",
			},
			effectTiming: {
				slow: "effect-slow",
				fast: "effect-fast",
				normal: "effect-normal",
			},
		},
		defaultVariants: {
			variant: "dark",
			effectTiming: "normal",
		},
	},
)

export default function Button({
	className,
	variant,
	outline,
	hover,
	hoverEffect,
	effectTiming,
	...props
}: ButtonProps) {
	return (
		<button
			{...props}
			className={ButtonVariants({
				className,
				variant,
				hover,
				hoverEffect,
				effectTiming,
				outline,
			})}
		/>
	)
}
