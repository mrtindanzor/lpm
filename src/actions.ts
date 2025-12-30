import { watchBuild } from "../utils/build/registry"
import copyPackages from "./runners/add"
import { buildRegistry } from "./runners/build"
import initializeConfig from "./runners/init"

export const REGISTRY_ACTIONS = {
	init: initializeConfig,
	add: copyPackages,
	build: buildRegistry,
	"watch-build": watchBuild,
}
