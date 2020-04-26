const core = require('@actions/core')
const github = require('@actions/github')

module.exports.enforce = function() {
    try {
        const label = core.getInput('skipLabel')
        core.info(`Skip Label: ${label}`)

        core.info(`Path ${process.env['GITHUB_EVENT_PATH']}`)

        const pullRequest = github.context.payload.pull_request
        const labelNames = pullRequest.labels.map(l => l.name)

        if (!labelNames.includes(label)) {
            core.info(`Executing changelog enforcement check`)
        }
    } catch(error) {
        core.setFailed(error.message);
    }
};