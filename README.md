
# LPM (Local Package Manager)

**LPM** is a lightweight package manager for managing **reusable components** across projects without copy-pasting or fixing imports manually.  

It keeps all your reusable components in a **single project registry** and works fully **offline**.

---

## Installation

Clone the repo and install globally:

```bash
git clone <repo-url>
cd <repo-location>

npm install -g
```

Run `lpm` in any project:

```bash
lpm add <package>   # Install a specific package
lpm add             # Select from a list
```

---

## Aliases

- `dir` → directory  
- `exec` → execute

---

## Commands

```bash
lpm init           # Initialize project & config
lpm add <package>  # Copy package to project
lpm build          # Rebuild registry in NeDB
lpm watch-build    # Auto-build on registry changes
```

---

## Registry Directory

LPM uses **NeDB** (`db/dbs/registry.db`) to track components.

**Structure rules:**

- Top-level directories = **component types** (`utils`, `hooks`, `stores`)
- Subdirectories = **component names**
- Files inside subdirectory are automatically registered

Example structure:

```
registry/
├ utils/
│ └ cn/
│   └ cn.ts
├ hooks/
└ ui/
```

Example NeDB entry:

```json
{
  "_id": "73DtiQov0mvbfwlh",
  "type": "hooks",
  "name": "usedebounce",
  "deps": ["react"],
  "files": ["/hooks/useDebounce.ts"]
}
```

> Manual edits to `registry.db` are overwritten during `build`. `_id` is unique and auto-managed.

---

## LPM Configuration

Config file: `lpm.config.json`

```ts
type CONFIG_TYPE = {
  destination: string;               // Default install folder
};

export const CONFIG: CONFIG_TYPE = {
  destination: "src/*",
};
```

Config is auto-created with `lpm init`.

---

## How LPM Works

**Workflow diagram (ASCII):**

```
       ┌─────────────┐
       │  registry/  │
       └─────┬───────┘
             │
             ▼
      ┌───────────────┐
      │  LPM build    │
      │ (NeDB updates)│
      └─────┬─────────┘
            │
 ┌──────────┴───────────┐
 │                      │
 ▼                      ▼
lpm add <package>     watch-build
 │                      │
 ▼                      ▼
Copies files → project Auto rebuilds registry
```

Steps:

1. **Init**: Create config & set installation paths.
2. **Build**: Scan `registry/`, add new components to **NeDB**, remove deleted ones.
3. **Add**: Copy packages to project, update imports, track missing dependencies.
4. **Watch-build**: Auto-rebuild registry on file changes.

---

## Non-Goals

- ❌ Versioning  
- ❌ Publishing  
- ❌ Conflict resolution  
- ❌ Replacing npm/yarn/pnpm  
- ❌ Language-agnostic guarantees  

---

## Example Usage

```bash
# Initialize project
lpm init

# Build registry
lpm build

# Watch registry changes
lpm watch-build

# Add package
lpm add cn
```

> ✅ Offline, fast, and deterministic: LPM keeps all reusable components synced without manual copy/paste.
