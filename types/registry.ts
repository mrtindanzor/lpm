export type REGISTRY_TYPE = Record<string, REGISTRY_SECTIONS>;

export type REGISTRY_SECTIONS = REGISTRY_PACKAGE_TYPE[];

export type REGISTRY_PACKAGE_TYPE = {
  name: string;
  files: string[];
  deps?: string[];
};
