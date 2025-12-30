import tryCatch from "../../utils/lib";
import { getConfigFile } from "../../utils/common";
import initializeConfig from "./init";
import { fileCopier, getAddPackages } from "../../utils/add/addUtil";

export default async function copyPackages() {
  //Retrieve config file
  const config = await getConfigFile();

  //Check if a dest was not provided but config exists
  if (!config) await initializeConfig();

  //Filter submitted arguments for add packages
  const [packages, getPackagesErr] = await tryCatch(getAddPackages());

  if (getPackagesErr) return console.log(getPackagesErr);

  //Start files copy
  await fileCopier(packages, config);
}
