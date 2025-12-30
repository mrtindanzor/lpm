import type { CONFIG_TYPE } from "../types/config";
import {
  CONFIG,
  CONFIG_NAME,
  EXTRACT_IMPORT_REGEX_KEYS,
  REGISTRY_DECORATOR,
} from "./static_constants";
import type {
  EXTRACT_IMPORT_KEY_PROPS,
  RetryAsyncProps,
  tsConfigType,
} from "../types/common";
import { regImpsPatn, splitDir } from "./regPatterns";
import { joinPaths, readAndParseFileToJson, writeFileToPath } from "./utils";
import fs from "node:fs/promises";
import tryCatch from "./lib";
import { ts } from "ts-morph";

export async function getConfigFile(): Promise<null | CONFIG_TYPE> {
  const __dir = process.cwd();

  const configPath = joinPaths(__dir, `${CONFIG_NAME}.json`);

  const config = await readAndParseFileToJson<CONFIG_TYPE | undefined>(
    configPath,
  );

  return config;
}

export async function RetryAsync<T>({
  cb,
  error,
  retries = 1,
  returnType = "string",
}: RetryAsyncProps<T>) {
  let answer: T;

  for (let retried = 0; retried < retries; retried++) {
    console.log(`Retries ${retried} / ${retries}`);

    answer = await cb();
    if (answer && typeof answer === returnType) return answer;
  }

  throw error;
}

export function getDepsFromFile(file: string) {
  const entries = file.matchAll(regImpsPatn).toArray();

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

export async function isFileExists(path: string) {
  const [, notExists] = await tryCatch(fs.access(path));

  return !notExists;
}

export async function getProjectRoot() {
  const pkgFile = "package.json";
  let root = "";
  let currDir = process.cwd(); //getEndingPath
  let completed = false;

  while (!root && !completed) {
    const found = await isFileExists(joinPaths(currDir, pkgFile));

    if (found) {
      root = currDir;
      break;
    }

    const { drive, dir } = splitDir(currDir);

    if (!dir) {
      completed = true;
      break;
    }
    currDir = joinPaths(drive, dir);
  }

  return root;
}

export function generateConfig(dest: string) {
  const config: CONFIG_TYPE = { ...CONFIG, destination: dest };

  return JSON.stringify(config, null, 2);
}

export async function getTsConfig() {
  const root = await getProjectRoot();

  const config = ts.readConfigFile(
    joinPaths(root, "tsconfig.json"),
    ts.sys.readFile,
  );

  return (config?.config || {}) as tsConfigType;
}

export async function updateTsConfigWithPath(path: string) {
  const root = await getProjectRoot();
  const tsConfig = await getTsConfig();

  const updatedTsConfig: tsConfigType = {
    ...(tsConfig ?? {}),
    compilerOptions: {
      ...(tsConfig?.compilerOptions ?? {}),
      paths: {
        ...(tsConfig?.compilerOptions?.paths ?? {}),
        [`${REGISTRY_DECORATOR}/*`]: [path],
      },
    },
  };

  await writeFileToPath(
    root,
    `tsconfig.json`,
    JSON.stringify(updatedTsConfig, null, 2),
  );
}

export async function createConfigFile(path: string) {
  const root = await getProjectRoot();
  await fs.mkdir(joinPaths(root, path), {
    recursive: true,
  });
  const lpmConfig = generateConfig(path);
  await writeFileToPath(root, `${CONFIG_NAME}.json`, lpmConfig);
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}
