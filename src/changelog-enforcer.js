const core = require('@actions/core')
const github = require('@actions/github')
const exec = require('@actions/exec')

module.exports.enforce = async function() {
    try {
        const skipLabel = core.getInput('skipLabel')
        const changeLogPath = core.getInput('changeLogPath')
        core.info(`Skip Label: ${skipLabel}`)
        core.info(`Changelog Path: ${changeLogPath}`)

        const pullRequest = github.context.payload.pull_request
        const labelNames = pullRequest.labels.map(l => l.name)
        const baseRef = pullRequest.base.ref

        if (!labelNames.includes(skipLabel)) {
            core.debug(`Executing changelog enforcement`)

            let myOutput = ''
            let myError = ''
            const options = {}
            options.listeners = {
                stdout: (data) => {
                    myOutput += data.toString();
                }
            }

            await exec.exec(`git diff origin/${baseRef} --name-only`, options)
            core.info(`${myOutput}`)
        }
    } catch(error) {
        core.setFailed(error.message);
    }
};