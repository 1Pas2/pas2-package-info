import { readFile } from "node:fs/promises";
import { join } from "node:path";
export interface PackageInfo {
  name: string;
  version: string;
  description?: string;
  private?: boolean;
}
export async function readPackageInfo(directory: string): Promise<PackageInfo> {
  const value: unknown = JSON.parse(
    (await readFile(join(directory, "package.json"), "utf8")).replace(
      /^\uFEFF/,
      "",
    ),
  );
  if (value === null || typeof value !== "object" || Array.isArray(value))
    throw new TypeError("Expected package object");
  const data = value as Record<string, unknown>;
  if (
    typeof data.name !== "string" ||
    !data.name ||
    typeof data.version !== "string" ||
    !data.version
  )
    throw new TypeError("Package name and version are required");
  if (data.description !== undefined && typeof data.description !== "string")
    throw new TypeError("Invalid description");
  if (data.private !== undefined && typeof data.private !== "boolean")
    throw new TypeError("Invalid private field");
  return {
    name: data.name,
    version: data.version,
    ...(data.description === undefined
      ? {}
      : { description: data.description as string }),
    ...(data.private === undefined ? {} : { private: data.private as boolean }),
  };
}
