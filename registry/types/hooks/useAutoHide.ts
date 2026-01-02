export type UseAutoHideProps = {
  isOpen: boolean;
  setIsOpen: () => void;
  event?: "mouseover" | "click" | ("mouseover" | "click")[];
};
