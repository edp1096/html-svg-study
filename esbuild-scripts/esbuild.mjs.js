import { build } from 'esbuild'

build({
    entryPoints: ["src/ts/main.ts"],
    outfile: "dist/main.mjs",
    bundle: true,
    minify: true,
    sourcemap: true,
    target: "esnext",
    format: "esm",
    define: { "process.env.NODE_ENV": "production" }
    // define: { "process.env.NODE_ENV": "developemnt" }
})
