import { watchBuild } from "../utils/build/registry";
import copyPackages from "./runners/add";
import initializeConfig from "./runners/init";
import { buildRegistry } from "./runners/build";

export const REGISTRY_ACTIONS = {
  init: initializeConfig,
  add: copyPackages,
  build: buildRegistry,
  "watch-build": watchBuild,
};
