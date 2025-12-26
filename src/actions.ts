import { watchBuild } from "./config/registry";
import copyPackages from "./runners/add";
import initializeConfig from "./runners/init";
import { buildRegistry } from "./runners/registry";

export const REGISTRY_ACTIONS = {
  init: initializeConfig,
  add: copyPackages,
  build: buildRegistry,
  "watch-build": watchBuild,
};
