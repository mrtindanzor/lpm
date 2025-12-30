import {
	createConfigFile,
	getConfigFile,
	updateTsConfigWithPath,
} from "../../utils/common"
import { selectInitDestination } from "../../utils/init/initUtil"

export default async function initializeConfig(manual = false) {
	//Retrieve config if exists
	const configExists = !manual && (await getConfigFile())

	//If config exists return
	if (configExists) return console.log(" Config file already exists!")

	//Prompt user for installation path
	let insDir = await selectInitDestination()

	const replace = (word: string) => word.replaceAll(/(\\\\|\/\/|\\)/g, "/")
	insDir = replace(`./${insDir}/*`)
	insDir = replace(insDir)

	//Update the ts config with the Registry Decoration in [tsconfig.json] compilierOptions.paths
	await updateTsConfigWithPath(insDir)

	//Create lpm config file
	await createConfigFile(insDir.replace("*", ""))
	if (!manual) console.log(" Project initialized successfully.")
}
