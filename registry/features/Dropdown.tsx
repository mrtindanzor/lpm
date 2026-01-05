"use client";

import { AnimatePresence } from "framer-motion";
import { ChevronsUpDown } from "lucide-react";
import { useCallback, useImperativeHandle, useRef, useState } from "react";
import { useAutoHide } from "lpm/hooks/useAutoHide";
import { cn } from "lpm/utils/cn";
import type {
  DropDownItemProps,
  DropDownListProps,
  DropDownProps,
} from "@/types/dropdown";
import Button from "lpm/ui/Buttons/Button";
import FramerAnimatePosition from "lpm/ui/AnimatePosition";

export default function Dropdown<T>({
  title,
  items,
  setValue,
  className,
  variant = "none",
  Icon,
  ...props
}: DropDownProps<T>) {
  const dropDownRef = useRef<{
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isOpen: boolean;
  }>(null);

  const { captureRef } = useAutoHide({
    setIsOpen: () => dropDownRef.current?.setIsOpen(false),
    isOpen: true,
  });

  return (
    <div
      {...props}
      ref={captureRef()}
      className={cn("relative w-fit ", className)}
    >
      <Button
        type="button"
        variant={variant}
        onClick={() => dropDownRef.current?.setIsOpen((a) => !a)}
        className=" grid grid-cols-[1fr_auto] gap-2 py-2 px-1 justify-center text-left items-center"
      >
        {title}
        {Icon ? (
          <Icon className="size-4 stroke-2 justify-center flex" />
        ) : (
          <ChevronsUpDown className="size-4 stroke-2 justify-center flex" />
        )}
      </Button>
      <DropdownList
        items={items}
        ref={dropDownRef}
        setValue={(value, index) => setValue(value, index)}
      />
    </div>
  );
}

export function DropdownList<T>({
  ref,
  items,
  setValue,
}: DropDownListProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      setIsOpen(value) {
        setIsOpen(value);
      },
      isOpen,
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <FramerAnimatePosition
          animate="show"
          exit="hidden"
          variants={{ hidden: { y: 5 } }}
          className="absolute z-20 rounded-md top-full right-0 max-h-80 border w-50"
        >
          <ul className="overflow-y-auto p-1 grid h-fit bg-neutral border backdrop-blur gap-1">
            {items.map((item, index) => (
              <DropItem
                key={item.title}
                setValue={(value) => setValue(value, index)}
                setIsOpen={setIsOpen}
                {...item}
              />
            ))}
          </ul>
        </FramerAnimatePosition>
      )}
    </AnimatePresence>
  );
}

function DropItem<T>({
  title,
  value,
  setValue,
  setIsOpen,
  icon: Icon,
  className,
  variant = "none",
}: DropDownItemProps<T>) {
  const handleToggle = useCallback(() => {
    setValue(value);
    setIsOpen(false);
  }, [setIsOpen, setValue, value]);
  return (
    <li>
      <Button
        type="button"
        onClick={handleToggle}
        variant={variant}
        className={cn(
          "w-full py-2 text-left text-sm  tracking-wide font-light grid grid-cols-[auto_1fr] gap-2 items-center",
          className,
        )}
      >
        {Icon && <Icon className="size-4" />}
        <span className="col-start-2">{title}</span>
      </Button>
    </li>
  );
}
