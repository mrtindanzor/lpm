import type { Write_File_Props } from "types/common";
import { isfilePattern } from "./regPatterns";
import path from "node:path";
import fs from "node:fs/promises";
import tryCatch, { syncTryCatch } from "./lib";

export function joinPaths(base: string, ...paths: string[]) {
  return path.join(base, ...paths);
}

export async function writeFileToPath(
  dir: string,
  fileName: string,
  file: string,
) {
  const path = joinPaths(dir, fileName);

  const [, mkdErr] = await tryCatch(fs.mkdir(dir, { recursive: true }));
  if (mkdErr) console.log("Making dirs failed", mkdErr);

  const [, wErr] = await tryCatch(fs.writeFile(path, file, "utf-8"));
  if (wErr) console.log("Writing file failed", wErr);
}

export async function readFile(filePath: string, parentdir?: string) {
  const newfilePath = !parentdir ? filePath : path.join(parentdir, filePath);

  const [file] = await tryCatch(
    fs.readFile(newfilePath, { encoding: "utf-8" }),
  );

  return file as string | undefined;
}

export function writeFileInPlace({
  file,
  indices,
  data,
  path = "",
}: Write_File_Props) {
  const [start, end] = indices;
  const right = file.slice(0, start);
  const left = file.slice(end);
  const dest = file.slice(start, end).replace(path, data);

  return `${right}${dest}${left}`;
}

export function isTsJsFile(name: string) {
  return (
    isfilePattern("ts").test(name) ||
    isfilePattern("js").test(name) ||
    isfilePattern("tsx").test(name) ||
    isfilePattern("jsx").test(name)
  );
}

export async function readAndParseFileToJson<T>(path: string) {
  const file = await readFile(path);

  const [parsedFile, error] = syncTryCatch<T>(() => {
    return JSON.parse(file) as T;
  });

  if (error) console.log(error);

  return parsedFile;
}
