const core = require("@actions/core");
const tc = require("@actions/tool-cache");

const base_url = "https://projects.gassets.space/patchver/0.1.0/patchver-__PLATFORM__-__VERSION__";

async function install(version, zip) {
    const url = replaceURL(base_url, version, (zip) ? "zip" : "tar.gz");

    const downloadPath = await tc.downloadTool(url);
    let extractedPath;
    if(zip) {
        extractedPath = await tc.extractZip(downloadPath);
    } else {
        extractedPath = await tc.extractTar(downloadPath);
    }

    const cachedPath = await tc.cacheDir(extractedPath, "patchver", version);
    core.addPath(cachedPath);

    return cachedPath;
}

function replaceURL(url, version, ext) {
    let platform;
    switch(process.platform) {
        case "win32":
            platform = "windows";
            break;

        case "darwin":
            platform = "darwin";
            break;

        case "linux":
        default:
            platform = "linux";
            break;
    }

    let arch;
    switch(process.arch) {
        case "ia32":
        default:
            arch = "386";
            break;

        case "x64":
            arch  = "amd64";
            break;

        case "arm":
            arch = "arm";
            break;

        case "arm64":
            arch = "arm64";
            break;
    }

    return url
        .replace("__PLATFORM__", `${platform}_${arch}`)
        .replace("__VERSION__", version)
        + `.${ext}`;
}

module.exports = {
    install
};
