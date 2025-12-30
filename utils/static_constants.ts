import type { CONFIG_TYPE } from "types/config"
import type { Package_Schema } from "types/db"

export const REQUIRED_ARGS = ["--dest"] as const

export const CLI_QUESTIONS = {
	"--dest": "Enter destination path...",
}
export const REGISTRY_DECORATOR = "@lpm"
export const EXTRACT_IMPORT_REGEX_KEYS = [
	"import",
	"defaultExp",
	"namedExp",
	"relDeps",
	"regDeps",
	"extDeps",
] as const

export const CONFIG_NAME = "lpm.config"
export const PACKAGE_KEYS: (keyof Package_Schema)[] = ["files", "name", "deps"]

export const CONFIG: CONFIG_TYPE = {
	destination: "src/*",
}

export const HELP = `

    lpm init           Generate config file

    lpm add <package>  Enter package name

    lpm add            Select from list of available available components

    lpm build          Build the component registry from the registry directory

    lpm watch-build    Watch the component directory and auto build registry

  `
