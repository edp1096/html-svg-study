import { buildSync } from 'esbuild'
import fs from "fs"

const result = buildSync({
    entryPoints: ["css/style.css"],
    outdir: "dist",
    bundle: true,
    minify: true
})

if (result.errors.length == 0 && result.warnings.length == 0) {
    fs.copyFileSync("css/style.css.map", "dist/style.css.map")
}