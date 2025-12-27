import type { CLI_OPTIONS } from "../../types/config";
import { getConfigFile } from "../../utils/common";
import { writeFileToPath } from "../../utils/utils";
import { selectInitDestination } from "../../utils/initUtil";
import { getConfig } from "../../utils/constants";
import { CONFIG_NAME } from "../../utils/static_constants";
import fs from "node:fs/promises";

export default async function initializeConfig(_: Partial<CLI_OPTIONS>) {
  const configExists = await getConfigFile();

  if (configExists) {
    console.log("Config file already exists!");

    return;
  }

  const currentDir = process.cwd();

  const installDir = await selectInitDestination();
  const config = getConfig(installDir);

  await fs.mkdir(`${currentDir}${installDir}`, { recursive: true });
  await writeFileToPath(currentDir, `${CONFIG_NAME}.json`, config);
  console.log("Project initialized successfully.");
}
