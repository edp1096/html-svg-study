import { build } from 'esbuild'

build({
    entryPoints: ["src/ts/main.ts"],
    outfile: "dist/main.js",
    bundle: true,
    minify: true,
    sourcemap: true,
    target: "es6",
    define: { "process.env.NODE_ENV": "production" }
    // define: { "process.env.NODE_ENV": "developemnt" }
})
