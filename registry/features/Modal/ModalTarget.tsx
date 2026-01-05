"use client";

import { type PropsWithChildren, useEffect } from "react";
import { useModal } from "./ModalProvider";

export function ModalTarget() {
  const { modalRef } = useModal();

  return <div ref={modalRef} />;
}

export function InertToggle({ children }: PropsWithChildren) {
  const { totalOpenedModals } = useModal();

  useEffect(() => {
    if (totalOpenedModals > 0)
      document.documentElement.classList.add("overflow-y-hidden");
    else document.documentElement.classList.remove("overflow-y-hidden");

    return () => {
      document.documentElement.classList.remove("overflow-y-hidden");
    };
  }, [totalOpenedModals]);

  return <div inert={totalOpenedModals > 0}>{children}</div>;
}
