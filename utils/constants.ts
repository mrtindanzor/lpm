import getRegistryDb from "../db/registry"
import type { CLI_SELECTOR_OPTION } from "../types/common"
import tryCatch, { toCapitalized } from "./lib"
import { joinPaths } from "./utils"

export const INIT_QUESTIONS = [
	{
		label: "Recommended",
		value: "src",
		hint: "/src",
	},
	{
		label: "Project root",
		value: "/",
		hint: "/",
	},
	{
		label: "Manual input",
		value: "manual",
	},
]
export const WORKING_DIR = import.meta.dirname.replace("utils", "")

export const REGISTRY_PATH = joinPaths(WORKING_DIR, "registry")

export async function getSelectOptions(): Promise<CLI_SELECTOR_OPTION[]> {
	const db = await getRegistryDb()
	const [docs] = await tryCatch(db.find({}))

	return docs.map((doc) => {
		const { type, name } = doc
		return {
			value: name,
			label: toCapitalized(name),
			hint: type,
		}
	})
}
