import type {
  REGISTRY_PACKAGE_TYPE,
  REGISTRY_TYPE,
} from "../../types/registry";
import { REGISTRY_PATH, REGISTRY_FILE_PATH } from "../../utils/constants";
import tryCatch from "../../utils/lib";
import fs from "node:fs/promises";
import { readAndParseFileToJson, writeFileToPath } from "../../utils/common";
import path from "node:path";

let watcherTimeoutId: ReturnType<typeof setTimeout> = null;

export const watchBuild = async () => {
  const ac = new AbortController();
  const { signal } = ac;
  const watcher = fs.watch(REGISTRY_PATH, { signal });

  console.log("👁️ Watching registry for file changes...");

  for await (const event of watcher) {
    if (
      event.filename !== "registry.json" &&
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

    const buildPackages = dirs.map(async (dir) => {
      const isDir = !dir.isFile();
      const dirname = dir.name;

      if (dirname === "registry.json") return;
      if (isDir) validDirs.push(dirname);

      const packPath = path.join(REGISTRY_PATH, dirname);
      const packages = await packageBuilder(packPath);

      registry[dirname] = packages || [];

      if (isDir && !(dirname in registry)) newDirs.push(dirname);
    });

    console.log("- Building packages");

    await Promise.allSettled(buildPackages);

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

export const packageBuilder = async (basePath: string) => {
  const components: REGISTRY_PACKAGE_TYPE[] = [];

  const [dirs, err] = await tryCatch(
    fs.readdir(basePath, { withFileTypes: true }),
  );

  if (err) return console.log("Reading packages sections failed ", err);

  if (dirs) {
    console.log("- Reading packages");

    const getPackageContents = dirs.map(async (dir) => {
      const dirname = dir.name;
      const packagePath = path.join(basePath, dirname);

      if (dir.isFile()) return;

      const contents = await filesBuilder(packagePath, dirname.toLowerCase());
      return contents;
    });

    const results = await Promise.allSettled(getPackageContents);

    results.forEach((result) => {
      if (result.status === "fulfilled" && result.value)
        components.push(result.value);
    });
  }

  return components;
};

export const filesBuilder = async (path: string, name: string) => {
  const packContents: REGISTRY_PACKAGE_TYPE = { name, files: [] };

  const [entries] = await tryCatch(fs.readdir(path, { withFileTypes: true }));
  if (!entries) return packContents;

  for (const entry of entries) {
    if (!entry.isFile()) continue;

    const name = entry.name.toLowerCase();

    if (name.startsWith("type")) {
      packContents.type = entry.name;
      continue;
    }

    packContents.files.push(entry.name);
  }

  return packContents;
};
