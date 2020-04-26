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
            await exec.exec(`git diff origin/${baseRef} --name-only | grep '${changeLogPath}'`)
        }
    } catch(error) {
        core.setFailed(error.message);
    }
};