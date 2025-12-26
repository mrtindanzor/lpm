import process from "node:process";
import {
  getAddPackages,
  getMissingArgs,
  getMissingArgsQuestions,
  promptForMissingArgs,
} from "../../utils/addUtil";
import { REQUIRED_ARGS, CLI_QUESTIONS } from "../../utils/constants";
import type { CLI_OPTIONS } from "../../types/config";
import tryCatch, { syncTryCatch } from "../../utils/lib";
import { getConfigFile } from "../../utils/common";

export default async function copyPackages(args: Partial<CLI_OPTIONS>) {
  let options = args;
  let required = [...REQUIRED_ARGS];

  const config = getConfigFile();
  if (config) required = required.filter((arg) => arg !== "--dest");

  const missing = getMissingArgs(args, required);
  const [questions, error] = syncTryCatch(() =>
    getMissingArgsQuestions(missing, CLI_QUESTIONS),
  );
  if (error) return console.error(error);

  if (questions.length > 0) {
    const [data, error] = await tryCatch(
      promptForMissingArgs(options, questions),
    );
    if (error) return console.error(error);

    options = data;
  }

  const [packages, getPackagesErr] = await tryCatch(
    getAddPackages(process.argv),
  );

  if (getPackagesErr) return console.log(getPackagesErr);

  console.log(packages);
}
