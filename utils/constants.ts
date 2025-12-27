import type { CONFIG_TYPE } from "../types/config";
import { toCapitalized } from "./lib";
import { joinPaths, readFile } from "./utils";
import type { REGISTRY_SECTIONS, REGISTRY_TYPE } from "../types/registry";
import type { CLI_SELECTOR_OPTION } from "../types/common";
import { REGISTRY_ACTIONS } from "../src/actions";
import tryCatch from "./lib";

export const ACTIONS = Object.keys(REGISTRY_ACTIONS);

export const INIT_QUESTIONS = [
  {
    label: "Recommended",
    value: "recommended",
    hint: "/src",
  },
  {
    label: "Project root",
    value: "base",
    hint: "/",
  },
  {
    label: "Manual input",
    value: "manual",
  },
];
export const WORKING_DIR = import.meta.dirname.replace("utils", "");

export const REGISTRY_PATH = joinPaths(WORKING_DIR, "registry");
export const REGISTRY_FILE_PATH = joinPaths(REGISTRY_PATH, "registry.json");

const getRegistry = async () => {
  const [reg] = await tryCatch(readFile(REGISTRY_FILE_PATH));
  if (reg) return (JSON.parse(reg) as REGISTRY_TYPE) || {};
  return {};
};

export const REGISTRY = await getRegistry();

const CONFIG_COMPONENTS =
  Object.keys(REGISTRY).length < 1
    ? {}
    : Object.keys(REGISTRY)
        .map((reg) => ({ [reg]: `${reg}/` }))
        .reduce((prev, current) => ({ ...(prev || {}), ...current }));

export const CONFIG: CONFIG_TYPE = {
  destination: "src/",
  components: CONFIG_COMPONENTS,
};

export const getConfig = (dest: string) => {
  const config: CONFIG_TYPE = { ...CONFIG, destination: dest };

  return JSON.stringify(config, null, 2);
};

export const SELECT_PACKAGE_OPTIONS: CLI_SELECTOR_OPTION[] = [];

Object.entries(REGISTRY).forEach((pack) => {
  const [type, _components] = pack;
  const components: REGISTRY_SECTIONS = _components;

  components.forEach((comp) => {
    SELECT_PACKAGE_OPTIONS.push({
      value: comp.name,
      label: toCapitalized(comp.name),
      hint: type,
    });
  });
});
