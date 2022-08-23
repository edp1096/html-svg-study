import { build } from 'esbuild'

build({
    entryPoints: ["src/ts/events.ts"],
    outfile: "dist/events.js",
    bundle: true,
    minify: true,
    sourcemap: true,
    target: "es6",
    define: { "process.env.NODE_ENV": "production" }
    // define: { "process.env.NODE_ENV": "developemnt" }
})
