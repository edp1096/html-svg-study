import fs from "fs"

fs.readdirSync("src/html").forEach((fname) => {
    if (fs.lstatSync("src/html/" + fname).isDirectory()) {
        const dirName = fname
        if (!fs.existsSync("dist/" + dirName)) { fs.mkdirSync("dist/" + dirName) }

        const dirChildren = fs.readdirSync("src/html/" + dirName)
        dirChildren.forEach((fname) => {
            fs.copyFileSync(`src/html/${dirName}/${fname}`, `dist/${dirName}/${fname}`)
        })
    } else {
        fs.copyFileSync(`src/html/${fname}`, `dist/${fname}`)
    }
})
