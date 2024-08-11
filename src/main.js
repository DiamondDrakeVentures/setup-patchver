const core = require("@actions/core");
const tc = require("@actions/tool-cache");
const install = require("./installer").install;

async function run() {
    try {
        const version = core.getInput("patchver-version");
        const toolPath = tc.find("patchver", version);
        if(toolPath) {
            core.info(`Found in cache @ ${toolPath}`);
            core.setOutput("patchver-version", version);
            return;
        }

        if(process.platform === "win32") {
            install(version, true);
        } else if(process.platform === "darwin") {
            install(version, false);
        } else {
            install(version, false);
        }
    } catch(error) {
        core.setFailed(error);
    }
}

module.exports = {
    run
};
