import { Project } from "ts-morph";
import { REGISTRY_DECORATOR } from "./static_constants";
import { isTsJsFile } from "./utils";

const project = new Project({
  compilerOptions: {
    allowJs: true,
    target: 99,
  },
});

export async function getExternalDeps(filepath: string) {
  const deps: Set<string> = new Set();

  if (!isTsJsFile(filepath)) return deps;

  const sourceFile = project.addSourceFileAtPath(filepath);
  await sourceFile.refreshFromFileSystem();

  const imports = sourceFile.getImportDeclarations();

  imports.forEach((imp) => {
    const mod = imp.getModuleSpecifierValue();
    if (mod.startsWith("node:")) null;
    else if (mod.startsWith(".")) null;
    else if (mod.startsWith(REGISTRY_DECORATOR)) null;
    else deps.add(imp.getModuleSpecifierValue());
  });

  return deps;
}
