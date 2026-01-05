import { Project } from "ts-morph";
import { WORKING_DIR } from "../../utils/constants";
import { arraysToSet } from "../../utils/lib";
import { REGISTRY_DECORATOR } from "../static_constants";
import { isTsJsFile, joinPaths } from "../utils";

export const VISITED = new Map<
  string,
  Promise<{ deps: Set<string>; files: Set<string> }>
>();

const project = new Project({
  tsConfigFilePath: joinPaths(WORKING_DIR, "tsconfig.json"),
  compilerOptions: {
    allowJs: true,
    target: 99,
  },
});

const getPathPatn = new RegExp(
  `[${WORKING_DIR.replaceAll("\\", "\\\\")}]/registry(?<path>[\\s\\S]+)$`,
  "i",
);

const extDepPatn = /(?<dep>@?((\w+-)*\w)+)(\/)?/;

export async function getExternalDeps(filepath: string) {
  if (VISITED.has(filepath)) return VISITED.get(filepath);

  const visitPromise = (async () => {
    let deps: Set<string> = new Set();
    let files: Set<string> = new Set();

    if (!isTsJsFile(filepath)) return { deps, files };

    const sourceFile = project.addSourceFileAtPath(filepath);
    await sourceFile.refreshFromFileSystem();

    for (const imp of sourceFile.getImportDeclarations()) {
      const mod = imp.getModuleSpecifierValue();
      if (mod.startsWith("node:")) continue;
      else if (mod.startsWith(".") || mod.startsWith(REGISTRY_DECORATOR)) {
        const source = imp.getModuleSpecifierSourceFile();

        if (!source) continue;
        const resolvedPath = source.getFilePath();
        const fileLocation = getPathPatn.exec(resolvedPath)?.groups?.path;

        const result = await getExternalDeps(resolvedPath);
        if (!result) {
          files.add(fileLocation);
          continue;
        }

        const { deps: nestedDeps, files: nestedFiles } = result;

        deps = arraysToSet(nestedDeps, deps);
        files = arraysToSet(nestedFiles, files);

        files.add(fileLocation);
      } else {
        const depName = extDepPatn.exec(imp.getModuleSpecifierValue())?.groups
          ?.dep;

        deps.add(depName);
      }
    }

    return { deps, files };
  })();

  VISITED.set(filepath, visitPromise);

  return visitPromise;
}
