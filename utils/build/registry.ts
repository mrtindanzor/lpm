import type { Dirent } from "node:fs";
import fs, { constants } from "node:fs/promises";
import type { Package_Schema } from "types/db";
import getRegistryDb from "../../db/registry";
import { REGISTRY_PATH } from "../constants";
import tryCatch, { arraysToSet } from "../lib";
import { getFileName, splitDir } from "../regPatterns";
import { isTsJsFile, joinPaths } from "../utils";
import { morpVisit } from "./imports-resolver";

let watcherTimeoutId: ReturnType<typeof setTimeout> = null;
let parts: string[] = [];

export async function watchBuild() {
  const watcher = fs.watch(REGISTRY_PATH, { recursive: true });

  console.log("👁️ ", "Watching registry for file changes...");

  for await (const event of watcher) {
    if (event.eventType === "rename" || event.eventType === "change") {
      const currentSplit = event.filename.split(/(\/|\\)/);

      const notDelete = currentSplit.length > parts.length;

      const dir = notDelete ? event.filename : parts.join("/");

      if (notDelete) parts = currentSplit;

      if (watcherTimeoutId) clearTimeout(watcherTimeoutId);

      watcherTimeoutId = setTimeout(async () => {
        await resolveIndividualDir(dir);
        console.log("- Built packages");
      }, 3000);
    }
  }
}

export async function resolveIndividualDir(path: string) {
  parts = [];

  const patn = /(\\|\/)?(?<dirname>\w+)(\\|\/)?/;
  const matched = patn.exec(path);

  const typeName = matched?.groups?.dirname;

  if (!typeName) return;

  const typePath = joinPaths(REGISTRY_PATH, typeName);

  const [, notExists] = await tryCatch(fs.access(typePath, constants.F_OK));
  if (notExists) {
    const db = await getRegistryDb();

    await tryCatch(
      db.remove({ type: typeName.toLowerCase() }, { multi: true }),
    );
  }

  if (!notExists) await pkgsBuilder(typePath);
}

export async function builder() {
  const validDirs: string[] = [];

  console.log("- Reading registry files");

  const [dirs, err] = await tryCatch(
    fs.readdir(REGISTRY_PATH, { withFileTypes: true }),
  );

  if (err) return console.log("- Reading registry sections failed ", err);

  if (dirs) {
    console.log("- Resolving Folders");
    console.log("- Building packages");

    for (const dir of dirs) {
      const { ending } = splitDir(dir.name);
      const __dirname = ending || dir.name;
      const ___dirname = __dirname.replace(/(\/|\\)/g, "");

      if (___dirname === "types") continue;

      validDirs.push(___dirname);

      const pkg = joinPaths(REGISTRY_PATH, dir.name);
      await pkgsBuilder(pkg);
    }

    const db = await getRegistryDb();
    await tryCatch(db.remove({ type: { $nin: validDirs } }, { multi: true }));
  }

  console.log("- Registry Updated ");
}

export const pkgsBuilder = async (basePath: string) => {
  const validPackages: string[] = [];

  const [dirs, err] = await tryCatch(
    fs.readdir(basePath, { withFileTypes: true }),
  );

  if (err) return console.log("- Reading packages sections failed ", err);

  if (dirs) {
    console.log("- Reading packages");
    const db = await getRegistryDb();

    const { ending: __dirname } = splitDir(basePath);
    const ___dirname = __dirname.replace(/(\/|\\)/g, "");

    for (const dir of dirs) {
      const { deps, files } = await fileResolver(dir, basePath);
      const pkgName = getFileName(dir.name).toLowerCase();

      validPackages.push(pkgName);

      await tryCatch(
        db.update(
          { name: pkgName },
          {
            type: ___dirname,
            name: pkgName,
            deps: [...deps],
            files: [...files],
          },
          { upsert: true },
        ),
      );
    }

    await tryCatch(
      db.remove(
        { type: ___dirname, name: { $nin: validPackages } },
        { multi: true },
      ),
    );
  }
};

export async function dirResolver(path: string) {
  const [entries] = await tryCatch(fs.readdir(path, { withFileTypes: true }));
  if (!entries) return { deps: [], files: [] };

  const depsFiles = await Promise.all(
    entries.map(async (entry) => {
      const depsFiles = await fileResolver(entry, path);

      return depsFiles;
    }),
  );

  const deps: string[] = [];
  const files: string[] = [];

  let result = { deps, files };

  if (depsFiles.length > 0)
    result = depsFiles.reduce((accu, depsFile) => {
      return {
        deps: [...arraysToSet(accu.deps, depsFile.deps)],
        files: [...arraysToSet(accu.files, depsFile.files)],
      };
    });

  return result;
}

export async function fileResolver(
  entry: Dirent<string>,
  parentDir: string,
): Promise<Pick<Package_Schema, "files" | "deps">> {
  const filePath = joinPaths(parentDir, entry.name);

  if (!entry.isFile()) {
    const results = await dirResolver(filePath);
    return results;
  }

  const { deps, files } = await morpVisit(filePath);
  const fileName = filePath
    .replace(REGISTRY_PATH, "")
    .replace(/(\\\\|\\)/g, "/");

  return {
    files: [...files, isTsJsFile(filePath) ? fileName : ""],
    deps,
  };
}
