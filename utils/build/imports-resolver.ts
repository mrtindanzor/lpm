import { Project } from "ts-morph";
import { REGISTRY_DECORATOR } from "../static_constants";
import { isTsJsFile, joinPaths } from "../utils";
import { WORKING_DIR } from "../../utils/constants";
import type { Package_Schema } from "../../types/db";

const VISITED: Record<string, { deps: Set<string>; fils: Set<string> }>[] = [];

export async function morpVisit(
  path: string,
): Promise<Pick<Package_Schema, "deps" | "files">> {
  const visited = VISITED[path];

  if (!visited) {
    VISITED[path] = await getExternalDeps(path);
  }

  return VISITED[path];
}

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
  if (!isTsJsFile(filepath)) return { deps: [], files: [] };

  const sourceFile = project.addSourceFileAtPath(filepath);
  await sourceFile.refreshFromFileSystem();

  const imports = sourceFile.getImportDeclarations();

  const depsFiles = await Promise.all(
    imports.map(async (imp) => {
      const deps: Set<string> = new Set();
      const files: Set<string> = new Set();

      const mod = imp.getModuleSpecifierValue();
      if (mod.startsWith("node:")) null;
      else if (mod.startsWith(".") || mod.startsWith(REGISTRY_DECORATOR)) {
        const source = imp.getModuleSpecifierSourceFile();

        if (source) {
          const path = source.getFilePath();
          const fileLocation = getPathPatn.exec(path)?.groups?.path;

          const { deps: nestedDeps, files: nestedFiles } =
            await morpVisit(path);

          nestedDeps.forEach((dep) => {
            deps.add(dep);
          });

          nestedFiles.forEach((file) => {
            files.add(file);
          });

          files.add(fileLocation);
        }
      } else {
        const depName = extDepPatn.exec(imp.getModuleSpecifierValue())?.groups
          ?.dep;

        deps.add(depName);
      }

      return { deps, files };
    }),
  );

  const deps: Set<string> = new Set();
  const files: Set<string> = new Set();

  let result = { deps, files };

  if (depsFiles.length > 0)
    result = depsFiles.reduce((accu, depsFile) => {
      return {
        deps: new Set([...(accu?.deps || []), ...depsFile.deps]),
        files: new Set([...(accu?.files || []), ...depsFile.files]),
      };
    });

  return result;
}
