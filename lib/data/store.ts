import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

/**
 * Tiny JSON-file persistence layer for the demo.
 *
 * All reads/writes target files under <projectRoot>/data. Writes are atomic:
 * we serialise to a temp file in the same directory, then rename over the target
 * (rename is atomic on the same filesystem) so a crash mid-write can't corrupt data.
 *
 * IMPORTANT: only import this from server code (route handlers / server components).
 */

const DATA_DIR = path.join(process.cwd(), "data");

export type DataFile =
  | "jobs"
  | "employers"
  | "users"
  | "saved"
  | "searches"
  | "applications"
  | "profile"
  | "settings";

function filePath(file: DataFile): string {
  return path.join(DATA_DIR, `${file}.json`);
}

export async function readData<T>(file: DataFile): Promise<T> {
  const raw = await fs.readFile(filePath(file), "utf8");
  return JSON.parse(raw) as T;
}

export async function writeData<T>(file: DataFile, data: T): Promise<void> {
  const target = filePath(file);
  const tmp = path.join(DATA_DIR, `.${file}.${randomUUID()}.tmp`);
  const serialised = `${JSON.stringify(data, null, 2)}\n`;
  await fs.writeFile(tmp, serialised, "utf8");
  await fs.rename(tmp, target);
}

/** Generate a short, sortable-ish unique id with an optional prefix. */
export function createId(prefix = "id"): string {
  return `${prefix}_${randomUUID().slice(0, 8)}`;
}
