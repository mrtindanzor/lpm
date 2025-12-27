import { select, text } from "@clack/prompts";
import { SELECT_PACKAGE_OPTIONS } from "./constants";
import { RetryAsync } from "./common";
import type { CONFIG_TYPE } from "../types/config";

export const getMissingArgs = (
  allArgs: Record<string, unknown>,
  requiredArgs: readonly string[],
) => {
  const missing: string[] = [];

  requiredArgs.forEach((arg) => {
    const argIndex = allArgs[arg];
    if (!argIndex) missing.push(arg);
  });

  return missing;
};

export const getMissingArgsQuestions = (
  args: string[],
  questions: Record<string, string>,
) => {
  if (args.length < 1) return [];

  return args.map((arg) => {
    const question = questions[arg];
    if (!question) throw `Question for ${arg} does not exist in questions.`;

    return [arg, question];
  });
};

const selectPackage = async (retries = 1) => {
  const error = "Select at least one package";
  const cb = () =>
    select({
      message: "Select a package to add",
      options: SELECT_PACKAGE_OPTIONS,
    });

  let getSelected = await cb();

  if (getSelected && typeof getSelected === "string") return [getSelected];

  getSelected = await RetryAsync({
    cb: cb,
    error,
    retries,
  });

  if (getSelected && typeof getSelected === "string") return [getSelected];

  throw error;
};

export const getAddPackages = async (cliArgs: string[]) => {
  if (SELECT_PACKAGE_OPTIONS.length < 1)
    throw " No packages available at the moment.";

  const addIndex = cliArgs.indexOf("add");

  const remainingArgs = cliArgs.slice(addIndex + 1);

  const getIndexOfOptions = remainingArgs.findIndex((arg) =>
    arg.startsWith("--"),
  );

  if (getIndexOfOptions === -1) {
    const selected = await selectPackage();
    return selected;
  }

  const filteredPackages = remainingArgs.slice(0, getIndexOfOptions);

  if (filteredPackages.length < 1) {
    const selected = await selectPackage();
    return selected;
  }
  return filteredPackages;
};

export const promptForMissingArgs = async (
  args: Record<string, string>,
  questions: string[][],
  retries = 1,
) => {
  for (const [arg, question] of questions) {
    const error = `Enter a valid value, for ${arg}!`;
    const cb = () =>
      text({
        message: question,
      });
    let getAnswer = await cb();

    if (getAnswer && typeof getAnswer === "string") {
      args[arg] = getAnswer;
      continue;
    }

    getAnswer = await RetryAsync({
      retries,
      cb: cb,
      error,
    });

    if (getAnswer && typeof getAnswer === "string") {
      args[arg] = getAnswer;
      continue;
    }

    throw error;
  }

  return args;
};

export const fileCopier = async (config: CONFIG_TYPE) => {
  console.log(config);
};
