import type { REGISTRY_PACKAGE_TYPE, REGISTRY_TYPE } from "../types/registry";
import { getFileName } from "./regPatterns";
import { REGISTRY_PATH, REGISTRY_FILE_PATH } from "./constants";
import tryCatch from "./lib";
import fs from "node:fs/promises";
import {
  isTsJsFile,
  joinPaths,
  readAndParseFileToJson,
  writeFileToPath,
} from "./utils";
import path from "node:path";
import { getExternalDeps } from "./imports-resolver";
import type { Dirent } from "node:fs";

let watcherTimeoutId: ReturnType<typeof setTimeout> = null;

export const watchBuild = async () => {
  const watcher = fs.watch(REGISTRY_PATH, { recursive: true });

  console.log("👁️ ", "Watching registry for file changes...");

  for await (const event of watcher) {
    if (
      event.filename !== "registry.json" &&
      !event.filename.startsWith("shared") &&
      (event.eventType === "rename" || event.eventType === "change")
    ) {
      if (watcherTimeoutId) clearTimeout(watcherTimeoutId);

      watcherTimeoutId = setTimeout(buildTypes, 2000);
    }
  }
};

export const buildTypes = async () => {
  const validDirs: string[] = [];
  const newDirs: string[] = [];

  console.log("- Reading registry file");

  const registry: REGISTRY_TYPE =
    (await readAndParseFileToJson<REGISTRY_TYPE>(REGISTRY_FILE_PATH)) || {};

  const prevDirs = Object.keys(registry);

  console.log("- Reading registry files");

  const [dirs, err] = await tryCatch(
    fs.readdir(REGISTRY_PATH, { withFileTypes: true }),
  );
  if (err) return console.log("Reading registry sections failed ", err);

  if (dirs) {
    console.log("- Resolving Folders");

    console.log("- Building packages");
    await Promise.all(
      dirs.map(async (dir) => {
        const isDir = !dir.isFile();
        const dirname = dir.name;

        if (dirname === "registry.json" || dirname === "shared") return;
        if (isDir) validDirs.push(dirname);

        const pkg = path.join(REGISTRY_PATH, dirname);
        const pkgs = await pkgsBuilder(pkg);

        registry[dirname] = pkgs || [];

        if (isDir && !(dirname in registry)) newDirs.push(dirname);
      }),
    );

    console.log("- Built packages");
  }

  const remDirs = prevDirs.filter((dir) => !validDirs.includes(dir));
  const remDirLen = remDirs.length;

  if (remDirLen > 0)
    remDirs.forEach((dir) => {
      delete registry[dir];
    });

  const updatedRegistry = JSON.stringify(registry, null, 2);

  const validDirsLen = validDirs.length;
  const newDirsLen = newDirs.length;

  console.log("- updating registry types");
  console.log("");
  console.log(" Added", newDirsLen, "types");
  console.log(" Removed", remDirLen, "types");
  console.log(" Total types", validDirsLen);
  console.log("");

  await writeFileToPath(REGISTRY_PATH, "registry.json", updatedRegistry);
  console.log("- Registry types updated ✅ ");
};

export const pkgsBuilder = async (basePath: string) => {
  const components: REGISTRY_PACKAGE_TYPE[] = [];

  const [dirs, err] = await tryCatch(
    fs.readdir(basePath, { withFileTypes: true }),
  );

  if (err) return console.log("Reading packages sections failed ", err);

  if (dirs) {
    console.log("- Reading packages");

    await Promise.all(
      dirs.map(async (dir) => {
        const { deps, files } = await fileResolver(dir, basePath);

        const pack: REGISTRY_PACKAGE_TYPE = {
          name: getFileName(dir.name),
          deps: [...deps],
          files: [...files],
        };
        components.push(pack);
      }),
    );
  }

  return components;
};

export const dirResolver = async (path: string) => {
  const deps: Set<string> = new Set();
  const files: Set<string> = new Set();

  const [entries] = await tryCatch(fs.readdir(path, { withFileTypes: true }));
  if (!entries) return { deps: [], files: [] };

  await Promise.all(
    entries.map(async (entry) => {
      const { deps: _deps, files: _files } = await fileResolver(entry, path);
      _files.forEach((file) => {
        files.add(file);
      });
      _deps.forEach((dep) => {
        deps.add(dep);
      });

      return;
    }),
  );

  return { deps: [...deps], files: [...files] };
};

async function fileResolver(
  entry: Dirent<string>,
  parentDir: string,
): Promise<Omit<REGISTRY_PACKAGE_TYPE, "name">> {
  const filePath = joinPaths(parentDir, entry.name);

  if (!entry.isFile()) {
    const results = await dirResolver(filePath);

    return results;
  }

  const deps = await getExternalDeps(filePath);
  return {
    files: isTsJsFile(filePath) ? [filePath.replace(REGISTRY_PATH, "")] : [],
    deps: [...deps],
  };
}
