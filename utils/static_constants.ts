import type { REGISTRY_PACKAGE_TYPE } from "types/registry";

export const REQUIRED_ARGS = ["--dest"] as const;

export const CLI_QUESTIONS = {
  "--dest": "Enter destination path...",
};
export const REGISTRY_DECORATOR = "@registry";
export const EXTRACT_IMPORT_REGEX_KEYS = [
  "import",
  "defaultExp",
  "namedExp",
  "relDeps",
  "regDeps",
  "extDeps",
] as const;

export const CONFIG_NAME = "lpm.config";
export const PACKAGE_KEYS: (keyof REGISTRY_PACKAGE_TYPE)[] = [
  "files",
  "name",
  "deps",
];
