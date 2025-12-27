import type { CLI_OPTIONS } from "../../types/config";
import { buildTypes } from "../../utils/registry";

export async function buildRegistry(_: Partial<CLI_OPTIONS>) {
  await buildTypes();
  console.log("");
  console.log(" Completed build successfuly");
}
