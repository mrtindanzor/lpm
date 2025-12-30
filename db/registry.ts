import type { Package_Schema } from "../types/db";
import { joinPaths } from "../utils/utils";
import Datastore from "nedb-promises";

const dir = import.meta.dirname;

let registryDb: Datastore<Package_Schema>;

export default async function getRegistryDb() {
  if (registryDb) return registryDb;

  registryDb = Datastore.create({
    filename: joinPaths(dir, "dbs", "registry.db"),
    autoload: true,
  });

  registryDb.ensureIndex({ fieldName: "name" });
  registryDb.ensureIndex({ fieldName: "type" });

  return registryDb;
}
