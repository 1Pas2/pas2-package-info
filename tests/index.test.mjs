import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import * as api from "../dist/index.js";
test("read metadata", async () => {
  const d = await mkdtemp(join(tmpdir(), "pas2-package-"));
  try {
    await writeFile(
      join(d, "package.json"),
      JSON.stringify({
        name: "demo",
        version: "1.0.0",
        private: true,
        extra: 1,
      }),
    );
    assert.deepEqual(await api.readPackageInfo(d), {
      name: "demo",
      version: "1.0.0",
      private: true,
    });
  } finally {
    await rm(d, { recursive: true, force: true });
  }
});
test("missing package", async () =>
  await assert.rejects(
    api.readPackageInfo(join(tmpdir(), "pas2-absent-package")),
  ));
test("reject incomplete metadata", async () => {
  const d = await mkdtemp(join(tmpdir(), "pas2-package-"));
  try {
    await writeFile(join(d, "package.json"), "{}");
    await assert.rejects(api.readPackageInfo(d), /name and version/);
  } finally {
    await rm(d, { recursive: true, force: true });
  }
});
