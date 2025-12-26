import { getArguments } from "../utils/common";

import process from "node:process";
import { printLines } from "../utils/lib";
import { REGISTRY_ACTIONS } from "./actions";

const [action, args] = getArguments(process.argv);
printLines();

if (!action) {
  console.error(" Attach a command to execute");
}

if (action) {
  const callback = REGISTRY_ACTIONS[action];
  await callback(args);
}
printLines(1);
