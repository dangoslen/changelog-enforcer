const core = require('@actions/core')

module.exports.getPullRequestContext = function (context) {
    const pull_request = context.payload.pull_request
    core.info(`context is ${context}`)
    if (pull_request == undefined) {
        core.warning(`ChangeLog enforcer only runs for pull_request and pull_request_target event types`)
        return undefined
    }
    return context.payload.pull_request;
}