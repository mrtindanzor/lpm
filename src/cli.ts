import { printLines } from "../utils/lib"
import { HELP } from "../utils/static_constants"
import { REGISTRY_ACTIONS } from "./actions"

const action = process.argv[2]

printLines(1)
console.log("├ ", " Local Package Manager")
printLines(2)

if (!action) console.log(HELP)

if (action) {
	const callback = REGISTRY_ACTIONS[action]
	await callback()
}

printLines(1)
