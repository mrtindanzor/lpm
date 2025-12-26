#!/usr/bin/env node

import { spawn } from "node:child_process";
import path from "node:path";

const args = process.argv;
const dir = import.meta.dirname;

const winPlatform = process.platform === "win32";

const script = winPlatform ? "tsx.CMD" : "tsx";

const tsxPath = path.resolve(dir, `./node_modules/.bin/${script}`);
const cliPath = path.resolve(dir, "./src/cli.ts");

const child = spawn(tsxPath, [cliPath, ...args.slice(2)], {
  stdio: "inherit",
  shell: winPlatform,
});

child.on("exit", (code) => process.exit(code));
child.on("error", console.error);
