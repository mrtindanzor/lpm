import type { REGISTRY_ACTIONS } from "../src/actions"

export type CLI_ACTIONS = keyof typeof REGISTRY_ACTIONS & string

export type CLI_OPTIONS = {
	"--dest": string
}

export type CONFIG_TYPE = {
	destination: string
}
