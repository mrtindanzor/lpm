"use client"

import type { PromptContextProps, PromptProps } from "lpm/types/features/prompt"
import {
	createContext,
	type PropsWithChildren,
	useContext,
	useState,
} from "react"

const PromptContext = createContext<PromptContextProps>(null)

export function PromptProvider({ children }: PropsWithChildren) {
	const [prompt, setPrompt] = useState<PromptProps | null>(null)

	return (
		<PromptContext.Provider value={{ prompt, setPrompt }}>
			{children}
		</PromptContext.Provider>
	)
}

export default function usePrompt() {
	const ctx = useContext(PromptContext)

	if (!ctx) throw Error("Use prompt must be used within a Prompt Context")

	return ctx
}
