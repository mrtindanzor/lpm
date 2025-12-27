//Regex name group
// <import> for getting index of the current import statement
// <defaultExp> denotes the default import of a dependency
// <namedExp> denotes all the named import of a dependency
// <relDeps> dependecies that resolve relative to the file
// <regDeps> dependencies that resolve to a registry file, it may be a component that is reused, eg. a button imported from @/registry/button
// <extDeps> depencies that also install from the npm repository

// Charley the naming was long so shortened it, it applies to the pattern variables
// df #default
// ts #typescript type
// nd #named
// exp #exports
// patn #pattern
// dfNdExpPatn #default and name export works for React, { module }
// df_ndExpPatn #default or named export pattern, works for import React | { useState, useRef }

import { REGISTRY_DECORATOR } from "./static_constants";

export const dfTsExpPatn = /(?<tsTypes>type\s+)/;
export const ndTsExpPatn = /(?<tsTypes>type\s+\w(s*,))/;

export const ndExpPatn =
  /(type\s+)?[{][\s]*(?<namedExp>((type\s+)?\w+\s*(,\s*\w+)?),?\s*?)+[}]/;
export const dfExpPatn = /(?<defaultExp>(type\s+)?\w+)/;
export const df_ndExpPatn = new RegExp(
  `(${dfExpPatn.source}|${ndExpPatn.source})`,
);
export const dfNdExpPatn = new RegExp(
  `${dfExpPatn.source}\\s*,\\s*${ndExpPatn.source}`,
);
export const expPatn = new RegExp(
  `(${df_ndExpPatn.source}|${dfNdExpPatn.source})`,
);
export const relDepsPattern = /(?<relDeps>((\.){0,2}\/)+\w+(\/w+)?)/;
export const extDepsPattern = /(?<extDeps>@?\w+(\/\w+)*)/;
export const regDepsPattern = new RegExp(
  `(?<regDeps>${REGISTRY_DECORATOR}(\\/\\w+)+)`,
);

export const depsPattern = new RegExp(
  `['"](${regDepsPattern.source}|${relDepsPattern.source}|${extDepsPattern.source})['"]\\s*`,
);

export const extractImportPattern = new RegExp(
  `(?<import>import)\\s+${expPatn.source}?\\s+(?<from>from)\\s+${depsPattern.source}`,
  "dg",
);

export const isfilePattern = (type: string) => new RegExp(`.${type}$`);

export const getFileName = (file: string) => {
  const pattern = /^(?<filename>\w+)\W?/;
  return pattern.exec(file).groups?.filename;
};
