"use client";

import type { TabSelectorProps } from "lpm/types/ui/TabSelector";
import Button from "lpm/ui/Buttons/Button";
import { cn } from "lpm/utils/cn";
import { toCapitalized } from "lpm/utils/tocapitalized";

export default function TabSelector<T extends string>({
  selected,
  setValue,
  options,
  label,
}: TabSelectorProps<T>) {
  return (
    <div className="grid gap-y-2 col-span-full">
      <p className="text-xl">{label}</p>

      <ul className="flex items-center text-neutral border-2 overflow-hidden w-fit rounded outline outline-accent border-muted ">
        {options.map((option) => (
          <li key={option}>
            <Button
              type="button"
              hover="gold"
              hoverEffect="from-bottom"
              onClick={() => setValue(option)}
              className={cn(
                "rounded-none! border-none! outline-none! text-lg py-1!",
                option === selected && "bg-neutral text-muted",
              )}
            >
              {toCapitalized(option)}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
