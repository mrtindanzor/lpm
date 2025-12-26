import type { CLI_ACTIONS, CLI_OPTIONS, CONFIG_TYPE } from "../types/config";
import { ACTIONS, CONFIG_NAME, PACKAGE_KEYS } from "./constants";
import { syncTryCatch } from "./lib";
import fs from "node:fs/promises";
import tryCatch from "../main/utils/trycatch/trycatch";
import type { RetryAsyncProps } from "../types/common";
import type { REGISTRY_PACKAGE_TYPE } from "../types/registry";

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

export const writeFileToPath = async (
  dir: string,
  fileName: string,
  file: string,
) => {
  const path = `${dir}/${fileName}`;

  const [, mkdErr] = await tryCatch(fs.mkdir(dir, { recursive: true }));
  if (mkdErr) console.log("Making dirs failed", mkdErr);

  const [, wErr] = await tryCatch(fs.writeFile(path, file, "utf-8"));
  if (wErr) console.log("Writing file failed", wErr);
};

export const readAndParseFileToJson = async <T>(path: string) => {
  const [readFile] = await tryCatch(fs.readFile(path, { encoding: "utf-8" }));

  const [file, error] = syncTryCatch<T>(() => {
    return JSON.parse(readFile) as T;
  });

  if (error) console.log(error);

  return file;
};

export const getConfigFile = async () => {
  const __dir = process.cwd();

  const tsPath = `${__dir}/${CONFIG_NAME}.json`;
  const jsPath = `${__dir}/${CONFIG_NAME}.json`;

  const [, notTsConfigExists] = await tryCatch(fs.access(tsPath));
  if (!notTsConfigExists) return readAndParseFileToJson<CONFIG_TYPE>(tsPath);

  const [, notJsConfigExists] = await tryCatch(fs.access(jsPath));
  if (!notJsConfigExists) return readAndParseFileToJson<CONFIG_TYPE>(jsPath);

  return null;
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
