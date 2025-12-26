import type { CLI_OPTIONS } from "../../types/config";
import { getConfigFile, writeFileToPath } from "../../utils/common";
import { selectInitDestination } from "../../utils/initUtil";
import { getConfig, CONFIG_NAME } from "../../utils/constants";
import fs from "node:fs";

export default async function initializeConfig(_: Partial<CLI_OPTIONS>) {
  const configExists = await getConfigFile();

  if (configExists) {
    console.log("Config file already exists!");

    return;
  }

  const currentDir = process.cwd();

  const installDir = await selectInitDestination();
  const config = getConfig(installDir);

  fs.mkdirSync(`${currentDir}${installDir}`, { recursive: true });
  writeFileToPath(currentDir, `${CONFIG_NAME}.json`, config);
  console.log("Project initialized successfully.");
}
