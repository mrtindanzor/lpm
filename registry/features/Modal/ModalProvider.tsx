"use client"

import type { ModalContextProps } from "lpm/types/features/modal"
import {
	createContext,
	type PropsWithChildren,
	useContext,
	useRef,
	useState,
} from "react"

const ModalContext = createContext<ModalContextProps>(null)

export function ModalProvider({ children }: PropsWithChildren) {
	const modalRef = useRef<HTMLDivElement>(null)
	const [totalOpenedModals, setTotalOpenedModals] = useState(0)

	return (
		<ModalContext.Provider
			value={{ modalRef, totalOpenedModals, setTotalOpenedModals }}
		>
			{children}
		</ModalContext.Provider>
	)
}

export function useModal() {
	const ctx = useContext(ModalContext)
	if (!ctx) throw Error("Modal context must be used in Modal context")

	return ctx
}
