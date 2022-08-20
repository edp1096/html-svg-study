import { hello } from "./util"
hello("TypeScript")


async function svgFileNameSET() {
    const svgUses = document.querySelectorAll("svg > use")
    for (const i in svgUses) {
        if (svgUses[i].nodeType != undefined && svgUses[i].hasAttribute("xlink:href")) {
            const ref = svgUses[i].getAttribute("xlink:href")
            svgUses[i].setAttribute("xlink:href", "icons.svg" + ref)
        }
    }
}

export default svgFileNameSET()