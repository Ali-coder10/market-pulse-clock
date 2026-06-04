import { copyFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";

const outDir = "dist-github";

await rename(join(outDir, "index.github.html"), join(outDir, "index.html"));
await copyFile(join(outDir, "index.html"), join(outDir, "404.html"));
await writeFile(join(outDir, ".nojekyll"), "");

console.log("GitHub Pages static site prepared in dist-github/");
