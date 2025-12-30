import { builder } from "../../utils/build/registry";

export async function buildRegistry() {
  await builder();

  console.log("");
  console.log(" Completed build successfuly");
}
