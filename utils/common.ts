import type { CLI_ACTIONS, CLI_OPTIONS, CONFIG_TYPE } from "../types/config";
import {
  CONFIG_NAME,
  EXTRACT_IMPORT_REGEX_KEYS,
  PACKAGE_KEYS,
} from "./static_constants";
import type {
  EXTRACT_IMPORT_KEY_PROPS,
  RetryAsyncProps,
} from "../types/common";
import type { REGISTRY_PACKAGE_TYPE } from "../types/registry";
import { extractImportPattern } from "./regPatterns";
import { ACTIONS } from "./constants";
import { joinPaths, readAndParseFileToJson } from "./utils";

const isAction = (value: unknown): value is CLI_ACTIONS => {
  return ACTIONS.includes(value as CLI_ACTIONS);
};

export const isPackageKey = (
  value: unknown,
): value is keyof REGISTRY_PACKAGE_TYPE => {
  return PACKAGE_KEYS.includes(value as keyof REGISTRY_PACKAGE_TYPE);
};

export const getArguments = (cliArgs: string[]) => {
  const data = {};
  let action: CLI_ACTIONS | null = null;

  cliArgs.forEach((arg) => {
    if (isAction(arg)) {
      action = arg;

      return;
    }

    if (!arg.startsWith("--")) return;

    const argIndex = cliArgs.indexOf(arg);
    if (argIndex === -1) return;

    const input = cliArgs[argIndex + 1];
    if (input) data[arg] = input;
  });

  return [action as CLI_ACTIONS | null, data as Partial<CLI_OPTIONS>] as const;
};

export const getConfigFile = async (): Promise<null | CONFIG_TYPE> => {
  const __dir = process.cwd();

  const configPath = joinPaths(__dir, `${CONFIG_NAME}.json`);

  const config = await readAndParseFileToJson<CONFIG_TYPE>(configPath);

  return config;
};

export const getPackageJson = async (): Promise<null | CONFIG_TYPE> => {
  const __dir = process.cwd();

  const configPath = joinPaths(__dir, `package.json`);

  const config = await readAndParseFileToJson<CONFIG_TYPE>(configPath);
  return config;
};

export const RetryAsync = async <T>({
  cb,
  error,
  retries = 1,
  returnType = "string",
}: RetryAsyncProps<T>) => {
  let answer: T;

  for (let retried = 0; retried < retries; retried++) {
    console.log(`Retries ${retried} / ${retries}`);

    answer = await cb();
    if (answer && typeof answer === returnType) return answer;
  }

  throw error;
};

export function getDepsFromFile(file: string) {
  const entries = file.matchAll(extractImportPattern).toArray();

  const results = entries.map(extractRegGpNameAndIndices);

  const regDeps = results
    .map((res) => res.regDeps?.indices)
    .filter((dep) => Array.isArray(dep));

  return [regDeps, results] as const;
}

export function extractRegGpNameAndIndices(group: RegExpExecArray) {
  return EXTRACT_IMPORT_REGEX_KEYS.map((key) => ({
    [key]: {
      name: group.groups?.[key],
      indices: group.indices?.groups?.[key],
    },
  })).reduce((prev, curr) => ({
    ...(prev || {}),
    ...curr,
  })) as EXTRACT_IMPORT_KEY_PROPS;
}
