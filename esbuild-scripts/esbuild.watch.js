import { build, serve } from "esbuild"
import fs from "fs"
import { createServer, request } from "http"
import { spawn } from "child_process"
import jsdom from "jsdom"

import chokidar from "chokidar"
import path from "path"

function updateHTML(fpath) {
    fpath = fpath.replace(/\\/g, "/")

    const fname = path.basename(fpath.replace("src/html/", ""))
    const dname = fpath.replace("src/html/", "").replace(fname, "").replace(/\/+$/, "")

    const html = fs.readFileSync(fpath, "utf8")
    const dom = new jsdom.JSDOM(html)

    const script = '<script> (() => new EventSource("/esbuild").onmessage = () => location.reload())();</script>'
    dom.window.document.head.innerHTML += script

    let servePath = serveDIR
    if (dname != "") { servePath += `/${dname}` }

    if (!fs.existsSync(servePath)) { fs.mkdirSync(servePath) }
    fs.writeFileSync(`${servePath}/${fname}`, dom.serialize())
}

function updateFile(fpath) {
    fpath = fpath.replace(/\\/g, "/")

    const fname = path.basename(fpath.replace(/\\/g, "/").replace("src/html/", ""))
    const dname = fpath.replace("src/html/", "").replace(fname, "").replace(/\/+$/, "")

    let servePath = serveDIR
    if (dname != "") { servePath += `/${dname}` }

    if (!fs.existsSync(servePath)) { fs.mkdirSync(servePath) }
    fs.copyFileSync(fpath, `${servePath}/${fname}`)
}

// const op = { darwin: ['open'], linux: ['xdg-open'], win32: ['cmd', '/c', 'start'] }
// const ptf = process.platform

const serveDIR = "serve"
const clients = []
const addr = "127.0.0.1"
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

watchJS.entryPoints = ["src/ts/main.ts"]
watchJS.outfile = `${serveDIR}/main.js`
watchJS.target = "es6"
watchJS.format = "esm"

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

fs.readdirSync("src/html").forEach((fname) => {
    if (fs.lstatSync("src/html/" + fname).isDirectory()) {
        const dname = fname
        fs.readdirSync("src/html/" + dname).forEach((fname) => {
            if (fname.endsWith(".html")) {
                updateHTML(`src/html/${dname}/${fname}`)
            } else {
                updateFile(`src/html/${dname}/${fname}`)
            }
        })
    } else {
        if (fname.endsWith(".html")) {
            updateHTML(`src/html/${fname}`)
        } else {
            updateFile(`src/html/${fname}`)
        }
    }
})

const watchFiles = chokidar.watch("./src/html", { ignored: /^\./, persistent: true })
watchFiles.on("change", (fpath) => {
    console.log("Updated ", fpath)
    if (fpath.endsWith(".html")) {
        updateHTML(fpath)
    } else {
        updateFile(fpath)
    }

    const fname = path.basename(fpath)
    clients.forEach((res) => res.write(`data: ${fname} updated\n\n`))
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
        const fpath = ~url.split('/').pop().indexOf('.') ? url : `/index.html` //for PWA with router
        req.pipe(
            request({
                hostname: addr,
                port: port,
                path: fpath,
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
    console.log(`Running server on http://${addr}:${port}`)

    process.on('SIGINT', () => {
        fs.rmSync("serve", { recursive: true })
        process.exit(0)
    })
})
