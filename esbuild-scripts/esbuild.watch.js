import { build, serve } from "esbuild"
import fs from "fs"
import { createServer, request } from "http"
import { spawn } from "child_process"
import jsdom from "jsdom"

function updateHTML(arg) {
    const html = fs.readFileSync("src/html/index.html", "utf8")
    const dom = new jsdom.JSDOM(html)

    const script = dom.window.document.createElement("script")

    switch (arg) {
        case "js":
            script.src = "main.js"
            break
        case "mjs":
            script.type = "module"
            script.innerHTML = "\n" + `import "./main.mjs"` + "\n"
            break
    }

    dom.window.document.head.appendChild(script)
    fs.writeFileSync(`${serveDIR}/index.html`, dom.serialize())
}

// const op = { darwin: ['open'], linux: ['xdg-open'], win32: ['cmd', '/c', 'start'] }
// const ptf = process.platform

const arg = process.argv[2]
if (arg != "js" && arg != "mjs") {
    console.log("Usage: node esbuild.watch.js [js|mjs]")
    fs.rmSync("serve", { recursive: true })
    process.exit()
}

const serveDIR = "serve"
const clients = []
const port = 8000

if (!fs.existsSync(serveDIR)) { fs.mkdirSync(serveDIR) }

const watchJS = {
    bundle: true,
    banner: { js: ' (() => new EventSource("/esbuild").onmessage = () => location.reload())();' },
    minify: true,
    sourcemap: true,
    define: { "process.env.NODE_ENV": "developemnt" },
    watch: {
        onRebuild(error, result) {
            clients.forEach((res) => res.write('data: update\n\n'))
            clients.length = 0
            console.log(error ? error : 'js updated..')
        }
    }
}

switch (arg) {
    case "js":
        watchJS.entryPoints = ["src/ts/main.ts"]
        watchJS.outfile = `${serveDIR}/main.js`
        watchJS.target = "es6"
        watchJS.format = "esm"
        break
    case "mjs":
        watchJS.entryPoints = ["src/ts/main.ts"]
        watchJS.outfile = `${serveDIR}/main.mjs`
        watchJS.target = "esnext"
        watchJS.format = "esm"
        break
}

build(watchJS).catch(() => process.exit(1))

spawn("dart-sass\\sass.bat", ["--watch", "src/scss/main.scss", "css/style.css"])
const watchCSS = {
    entryPoints: ["css/style.css"],
    outfile: `${serveDIR}/style.css`,
    bundle: true,
    minify: true,
    watch: {
        onRebuild(error, result) {
            clients.forEach((res) => res.write('data: update\n\n'))
            clients.length = 0
            console.log(error ? error : 'css updated..')
        },
    },
}

setTimeout(() => { if (fs.existsSync("css/style.css")) { build(watchCSS) } }, 250)

updateHTML(arg)
fs.watchFile("src/html/index.html", { interval: 250 }, (curr, prev) => {
    if (curr.mtime > prev.mtime) {
        updateHTML(arg)
        clients.forEach((res) => res.write('data: update\n\n'))
    }
})


// https://github.com/evanw/esbuild/issues/802#issuecomment-819578182
const server = serve({ servedir: `${serveDIR}/` }, {}).then(() => {
    createServer((req, res) => {
        const { url, method, headers } = req
        if (req.url === '/esbuild') {
            return clients.push(
                res.writeHead(200, {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    Connection: 'keep-alive'
                })
            )
        }
        const path = ~url.split('/').pop().indexOf('.') ? url : `/index.html` //for PWA with router
        req.pipe(
            request({
                hostname: '0.0.0.0',
                port: 8000,
                path,
                method,
                headers
            }, (prxRes) => {
                res.writeHead(prxRes.statusCode, prxRes.headers)
                prxRes.pipe(res, { end: true })
            }),
            { end: true }
        )
    }).listen(port)
})

server.then(() => {
    console.log(`Running server ${arg} on http://localhost:${port}`)

    process.on('SIGINT', () => {
        fs.rmSync("serve", { recursive: true })
        process.exit(0)
    })
})
