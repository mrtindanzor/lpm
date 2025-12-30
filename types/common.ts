import type { EXTRACT_IMPORT_REGEX_KEYS } from "../utils/static_constants";

export type RetryAsyncProps<T = string> = {
  cb: () => Promise<T>;
  error: string;
  retries?: number;
  returnType?: string;
};

export type CLI_SELECTOR_OPTION = {
  label: string;
  value: string;
  hint?: string;
};

export type EXTRACT_IMPORT_REGEX_KEYS_TYPE = typeof EXTRACT_IMPORT_REGEX_KEYS;

export type EXTRACT_IMPORT_KEY_PROPS = {
  [key in EXTRACT_IMPORT_REGEX_KEYS_TYPE[number]]: {
    name: string;
    indices: [number, number];
  };
};

export type Write_File_Props = {
  indices: [number, number];
  data: string;
  path?: string;
  file: string;
};

export type PackageJson = {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
};

export type tsConfigType = {
  compilerOptions: {
    paths: Record<string, string[]>;
  };
};
