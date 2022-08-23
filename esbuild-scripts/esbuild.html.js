import fs from "fs"

fs.readdirSync("src/html").forEach((fname) => {
    if (fs.lstatSync("src/html/" + fname).isDirectory()) {
        const dname = fname
        if (!fs.existsSync("dist/" + dname)) { fs.mkdirSync("dist/" + dname) }
        fs.readdirSync("src/html/" + dname).forEach((fname) => {
            fs.copyFileSync(`src/html/${dname}/${fname}`, `dist/${dname}/${fname}`)
        })
    } else {
        fs.copyFileSync(`src/html/${fname}`, `dist/${fname}`)
    }
})
