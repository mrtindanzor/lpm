import fs from "node:fs/promises"
import { select, text } from "@clack/prompts"
import type { Package_Schema } from "types/db"
import getRegistryDb from "../../db/registry"
import type { PackageJson } from "../../types/common"
import type { CONFIG_TYPE } from "../../types/config"
import { getProjectRoot, isString, RetryAsync } from "../common"
import { getSelectOptions, REGISTRY_PATH } from "../constants"
import tryCatch, { printLines } from "../lib"
import { joinPaths, readAndParseFileToJson } from "../utils"

export async function selectPackage(retries = 1) {
	const error = "Select at least one package"
	const [SELECT_PACKAGE_OPTIONS] = await tryCatch(getSelectOptions())

	const cb = () =>
		select({
			message: "Select a package to add",
			options: SELECT_PACKAGE_OPTIONS,
		})

	let getSelected = await cb()

	if (getSelected && typeof getSelected === "string") return [getSelected]

	getSelected = await RetryAsync({
		cb: cb,
		error,
		retries,
	})

	if (getSelected && typeof getSelected === "string") return [getSelected]

	throw error
}

export async function getAddPackages() {
	const [packages] = await tryCatch(getSelectOptions())
	let filteredArgs = process.argv

	if (!packages || packages.length < 1)
		throw " No packages available at the moment."

	const addIndex = filteredArgs.indexOf("add")

	filteredArgs = filteredArgs
		.slice(addIndex + 1)
		.map((pkg) => pkg.toLowerCase())

	const getIndexOfOptions = filteredArgs.findIndex((arg) =>
		arg.startsWith("--"),
	)

	if (getIndexOfOptions === -1) {
		if (filteredArgs.length > 0) return filteredArgs

		const selected = await selectPackage()
		return selected
	}

	filteredArgs = filteredArgs.slice(0, getIndexOfOptions)

	if (filteredArgs.length < 1) {
		const selected = await selectPackage()

		return selected
	}
	return filteredArgs
}

export async function promptForMissingArgs(
	args: Record<string, string>,
	questions: string[][],
	retries = 1,
) {
	for (const [arg, question] of questions) {
		let answer: string | symbol
		const error = `Enter a valid value, for ${arg}!`

		const cb = () =>
			text({
				message: question,
			})

		answer = await cb()

		if (!answer)
			answer = await RetryAsync({
				retries,
				cb: cb,
				error,
			})

		if (isString(answer)) args[arg] = answer
		if (args[arg]) continue

		throw error
	}

	return args
}

export async function findPackages(
	pkgs: string[],
): Promise<[Package_Schema[], string[]]> {
	const db = await getRegistryDb()
	const [valid] = await tryCatch(db.find({ name: { $in: pkgs } }))

	if (!valid || valid.length < 1) return [[], pkgs] as const

	const invalidPkgs = pkgs.filter((pkg) => !valid.find((p) => p.name === pkg))

	return [valid, invalidPkgs] as const
}

export async function getNonExistingDeps(deps: string[]) {
	const projectRoot = await getProjectRoot()

	const packageJson = await readAndParseFileToJson<PackageJson>(
		joinPaths(projectRoot, "package.json"),
	)
	const notExists: string[] = []

	const existingDeps = {
		...packageJson.dependencies,
		...packageJson.devDependencies,
	}

	deps.forEach((dep) => {
		const isExist = existingDeps[dep]
		if (!isExist) notExists.push(dep)
	})

	return notExists
}

export async function doFilesCopy(pkgs: Package_Schema[], dest: string) {
	const deps: Set<string> = new Set()
	const projectRoot = await getProjectRoot()

	await Promise.resolve(
		pkgs.forEach(async (pkg) => {
			;(pkg.deps || []).forEach((dep) => {
				deps.add(dep)
			})

			const dir = joinPaths(projectRoot, dest)

			await fs.mkdir(dir, { recursive: true })

			await Promise.resolve(
				pkg.files.forEach(async (file) => {
					const source = joinPaths(REGISTRY_PATH, file)
					const destination = joinPaths(dir, file)

					await fs.cp(source, destination, { recursive: true })
				}),
			)
		}),
	)

	return [...deps]
}

export async function fileCopier(selectedPkgs: string[], config: CONFIG_TYPE) {
	const projectRoot = await getProjectRoot()
	if (!projectRoot) {
		console.log(" No package.json found in root")
		return printLines(1)
	}

	const [validPkgs, invalidPkgs] = await findPackages(selectedPkgs)

	if (invalidPkgs?.length > 0) {
		console.log(` These packages: [ ${invalidPkgs.join(", ")} ] were not found`)
		console.log("")

		if (invalidPkgs.length === selectedPkgs.length) return printLines(1)
	}

	const deps = await doFilesCopy(validPkgs, config.destination)

	let nonExistingDeps: string[] = []

	if (deps.length > 0) nonExistingDeps = await getNonExistingDeps(deps)
	console.log("")
	console.log(" Files copied successfully")
	console.log("")
	if (nonExistingDeps.length > 0) {
		const statement = ` Found ${nonExistingDeps.length}	missing packages. Run an install to add them. [ ${deps.join(", ")} ]`

		console.log(statement)
	}
}
