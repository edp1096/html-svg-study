import fs from "fs"
import jsdom from "jsdom"
import { minify } from "html-minifier"

const html = fs.readFileSync("src/html/index.html", "utf8")
const dom = new jsdom.JSDOM(html)

const script = dom.window.document.createElement("script")

switch (process.argv[2]) {
    case "js":
        script.src = "main.js"
        break
    case "mjs":
        script.type = "module"
        script.innerHTML = "\n" + `import "./main.mjs"` + "\n"
        break
    default:
        console.log("Usage: node esbuild.watch.js [js|mjs]")
        process.exit()
}

dom.window.document.head.appendChild(script)

const options = {
    collapseWhitespace: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeRedundantAttributes: true,
}

const fname = `dist/index-${process.argv[2]}.html`
fs.writeFileSync(fname, minify(dom.serialize(), options))

// fs.copyFileSync("src/html/index.html", `dist/index-${process.argv[2]}.html`)
