import type { CONFIG_TYPE } from "../types/config";
import { toCapitalized } from "./lib";
import path from "node:path";
import fs from "node:fs/promises";
import type {
  REGISTRY_PACKAGE_TYPE,
  REGISTRY_SECTIONS,
  REGISTRY_TYPE,
} from "../types/registry";
import type { CLI_SELECTOR_OPTION } from "../types/common";
import { REGISTRY_ACTIONS } from "../src/actions";
import tryCatch from "../main/utils/trycatch/trycatch";

export const ACTIONS = Object.keys(REGISTRY_ACTIONS);
export const REQUIRED_ARGS = ["--dest"] as const;

export const CLI_QUESTIONS = {
  "--dest": "Enter destination path...",
};

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

export const REGISTRY_PATH = path.join(WORKING_DIR, "registry");
export const REGISTRY_FILE_PATH = path.join(REGISTRY_PATH, "registry.json");

const getRegistry = async (): Promise<REGISTRY_TYPE> => {
  const [reg] = await tryCatch(fs.readFile(REGISTRY_FILE_PATH));

  if (reg) return (JSON.parse(reg) as REGISTRY_TYPE) || {};
  return {};
};

export const REGISTRY = await getRegistry();

export const CONFIG_NAME = "lpm.config";

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

export const PACKAGE_KEYS: (keyof REGISTRY_PACKAGE_TYPE)[] = [
  "files",
  "type",
  "deps",
];
