# LPM (Local Package Manager)

The **lpm** package manager aims to solve one problem and solve it well. Often, as developers, we tend to create components that we reuse across projects. The tiresome part is copy-pasting each time, fixing imports, or even the headache of opening another project just to copy a file.

LPM solves this problem by housing all your reusable components in a single project. At any time you need a package (component) inside your target project, simply run:

```bash
lpm add <package>
```

or:

```bash
lpm add
```

This will show a list of available packages, allowing you to choose and install one.
Yes, this works completely offline.

## Aliases

* `dir`  → directory
* `exec` → execute

## Current Available Commands

```shell
lpm init
# Initializes the project (specify copy locations for packages and import aliases)

lpm add <package> --dest
# The location the package will be copied to
# --dest is only mandatory if the package has not been initialized with `lpm init`
# Note: --dest takes priority over the config destination

lpm build
# Checks the Registry dir and updates the registry by removing deleted files and folders
# and adding newly created ones

lpm watch-build
# An extension of `lpm build`
# Watches the Registry dir for file changes and executes the build function to update the registry
```

## How Does the Registry Directory Work?

The Registry dir contains a `registry.json` file.

**Note:** This file should always exist inside the registry dir. If it does not, running `lpm` will throw an error. It must be a valid JSON file, even when empty. This file is the main source for all components.

The intended usage is to make the top-level directory the *type* of component. For example, if the component belongs to utilities, the top-level dir should be `utils`, and the component should be placed under it.

For now, LPM reads only folders inside the type dir. A type dir refers to the component category, such as `utils`, `hooks`, `stores`, etc. (whatever name you choose).

```json
{
  "utils": [
    {
      "name": "cn",
      "files": ["cn.ts"],
      "types": ["type.ts"]
    }
  ],
  "hooks": [
    {
      "name": "useDounce",
      "files": ["debounce.ts"],
      "types": ["type.debounce.ts"]
    }
  ]
}
```

```text
registry/        # This is the Registry dir
├ utils/         # This refers to a type dir
│ └ cn/          # This refers to the component
│                # The folder name is used as the component name,
│                # enabling `lpm add cn` or selection when running `lpm add`
│   ├ cn.ts      # All files under the parent dir (in this case `/cn`)
│                # are added to the registry as files
│                # (excluding files that begin with `type`)
│   └ type.ts    # Files beginning with `type` are added as types (TypeScript types)
├ ui/
└ hooks/
```

The working *Registry* dir can be changed inside the constants under the `utils` dir. Look for:

`utils/constants.ts`

```ts
export const REGISTRY_PATH = path.join(
  WORKING_DIR,
  "registry" /* Change this to update the registry path */
);
```

You can also alter the name of the registry JSON file.

**Note:** It must always exist inside the registry path.

`utils/constants.ts`

```ts
export const REGISTRY_FILE_PATH = path.join(
  REGISTRY_PATH,
  "registry.json" /* Change this to update the registry file name */
);
// Note: It must be a valid JSON file.
```

## The LPM Config File

The LPM config file contains configuration supplied to LPM automatically (if it exists), reducing redundant input.

```ts
type CONFIG_TYPE = {
  destination: string;
  components: Record<string, unknown>;
  // Components refer to all top-level type folders inside the registry,
  // e.g. hooks, utils
};

export const CONFIG: CONFIG_TYPE = {
  destination: "src/"
  /* Default installation location.
     Can be updated here or supplied via CLI interaction on a per-project basis. */,
  components: CONFIG_COMPONENTS,
};

export const CONFIG_NAME = "lpm.config";
// Can be edited to any name.
// Note: it will be saved to projects when `lpm init` is executed,
// so make it unique.
```

## Non-Goals

LPM is intentionally minimal. The following are **explicitly out of scope** to keep the tool focused and maintainable:

* **Semantic versioning or package versions**
  Components are not versioned. The registry represents the current state of the local source of truth.

* **Package publishing**
  There is no publish, push, or share mechanism. Distribution is handled outside of LPM.

* **Language-agnostic guarantees**
  While usable elsewhere, LPM is primarily designed with TypeScript projects in mind.

* **Automatic conflict resolution**
  LPM does not intelligently merge or resolve file conflicts. Handling collisions is left to the user.

* **Replacing existing package managers**
  LPM is not a replacement for npm, yarn, pnpm, or similar tools. It complements them.
