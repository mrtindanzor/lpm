"use client"

import type { TabSelectorProps } from "lpm/types/ui/TabSelector"
import Button from "lpm/ui/Buttons/Button"
import { cn } from "lpm/utils/cn"
import { toCapitalized } from "lpm/utils/tocapitalized"

export default function TabSelector<T extends string>({
	selected,
	setValue,
	options,
	label,
	className,
	...props
}: TabSelectorProps<T>) {
	return (
		<div {...props} className={cn("grid gap-y-2 col-span-full", className)}>
			<p className="text-xl">{label}</p>

			<ul className="flex flex-wrap *:flex-1 items-center text-neutral border-2 overflow-hidden w-fit rounded outline outline-accent border-muted ">
				{options.map(({ title, tip }) => (
					<li key={title}>
						<Button
							type="button"
							hover="gold"
							title={tip}
							hoverEffect="from-bottom"
							onClick={() => setValue(title)}
							className={cn(
								"rounded-none! whitespace-nowrap w-full! border-none! outline-none! text-lg py-1!",
								title === selected && "bg-neutral text-muted",
							)}
						>
							{toCapitalized(title)}
						</Button>
					</li>
				))}
			</ul>
		</div>
	)
}
