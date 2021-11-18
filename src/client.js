const fetch = require('node-fetch')
const core = require('@actions/core')

module.exports.findChangelog = async function (token, repository, pullRequestNumber, pageSize, changeLogPath) {
    let complete = false;
    let page = 1
    while (!complete) {
        core.debug(`Downloading page ${page} of pull request files from  /repos/${repository}/pulls/${pullRequestNumber}/files`)
        const options = addAuth(token, {})
        const response = await fetch(`https://api.github.com/repos/${repository}/pulls/${pullRequestNumber}/files?per_page=${pageSize}&page=${page}`, options)
        if (!response.ok) {
            throw new Error(`Got a ${response.status} response from GitHub API`)
        }
        const files = await response.json()
        core.debug(`Downloaded page ${page} of pull request files`)

        core.debug("Filtering for changelog")
        const filtered = files
            .filter(f => f.status !== 'deleted')
            .filter(f => f.filename === changeLogPath)

        if (filtered.length == 1) {
            return filtered[0]
        } else if (files.length < pageSize) {
            complete = true
        } else {
            page++
        }
    }
    return undefined
}

module.exports.downloadChangelog = async function (token, changelogUrl) {
    core.debug(`Downloading changelog from ${changelogUrl}`)
    const options = addAuth(token, {})
    const response = await fetch(`${changelogUrl}`, options)
    if (!response.ok) {
        throw new Error(`Got a ${response.status} response from GitHub API`)
    }
    const changelog = await response.text()
    core.debug("Downloaded changelog")
    return changelog
}

function addAuth(token, options) {
    const enriched = { ...options }
    if (!enriched['headers']) {
        enriched['headers'] = {}
    }
    enriched['headers']['Authorization'] = `Bearer ${token}`
    return enriched
}