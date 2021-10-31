const core = require('@actions/core')
const github = require('@actions/github')
const fetch = require('node-fetch')
const versionExtractor = require('./version-extractor')
const labelExtractor = require('./label-extractor')
const contextExtractor = require('./context-extractor')

// Input keys
const IN_CHANGELOG_PATH = 'changeLogPath'
const IN_EXPECTED_LATEST_VERSION = 'expectedLatestVersion'
const IN_VERSION_PATTERN = 'versionPattern'
const IN_UPDATE_CUSTOM_ERROR = 'missingUpdateErrorMessage'
const IN_SKIP_LABELS = 'skipLabels'
const IN_TOKEN = "token"

// Output keys
const OUT_ERROR_MESSAGE = 'errorMessage'

module.exports.enforce = async function () {
    try {
        const skipLabelList = getSkipLabels()
        const changeLogPath = core.getInput(IN_CHANGELOG_PATH)
        const missingUpdateErrorMessage = getMissingUpdateErrorMessage(changeLogPath)
        const expectedLatestVersion = core.getInput(IN_EXPECTED_LATEST_VERSION)
        const versionPattern = core.getInput(IN_VERSION_PATTERN)
        const token = core.getInput(IN_TOKEN)

        core.info(`Skip Labels: ${skipLabelList}`)
        core.info(`Changelog Path: ${changeLogPath}`)
        core.info(`Missing Update Error Message: ${missingUpdateErrorMessage}`)
        core.info(`Expected Latest Version: ${expectedLatestVersion}`)
        core.info(`Version Pattern: ${versionPattern}`)

        const context = github.context
        const pullRequest = contextExtractor.getPullRequestContext(context)
        if (!pullRequest) {
            return
        }

        const repository = `${context.repo.owner}/${context.repo.repo}`
        const labelNames = pullRequest.labels.map(l => l.name)
        if (!shouldEnforceChangelog(labelNames, skipLabelList)) {
            return
        }
        const changelog = await checkChangeLog(token, repository, pullRequest.number, changeLogPath, missingUpdateErrorMessage)
        if (shouldEnforceVersion(expectedLatestVersion)) {
            return
        }
        // await validateLatestVersion(expectedLatestVersion, versionPattern, changelog.raw_url)
    } catch (err) {
        core.setOutput(OUT_ERROR_MESSAGE, err.message)
        core.setFailed(err.message)
    }
};

function getSkipLabels() {
    const skipLabels = core.getInput(IN_SKIP_LABELS)
    return labelExtractor.extractLabels(skipLabels)
}

function getMissingUpdateErrorMessage(changeLogPath) {
    const customMessage = core.getInput(IN_UPDATE_CUSTOM_ERROR)
    if (customMessage != null && customMessage != '') {
        return customMessage
    }
    return `No update to ${changeLogPath} found!`
}

function shouldEnforceChangelog(labelNames, skipLabelList) {
    return !labelNames.some(l => skipLabelList.includes(l))
}

function shouldEnforceVersion(expectedLatestVersion) {
    return expectedLatestVersion === ''
}

async function checkChangeLog(token, repository, pullRequestNumber, changeLogPath, missingUpdateErrorMessage) {
    core.debug(`Downloading pull request files from  /repos/${repository}/pulls/${pullRequestNumber}/files`)
    const response = await fetch(`/repos/${repository}/pulls/${pullRequestNumber}/files?per_page=100`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    core.debug("Downloaded pull request files")

    let normalizedChangeLogPath = changeLogPath
    if (normalizedChangeLogPath.startsWith('./')) {
        normalizedChangeLogPath = normalizedChangeLogPath.substring(2)
    }

    core.debug("Filtering for changelog")
    const filtered = response.data
        .filter(f => f.status !== 'deleted')
        .filter(f => f.filename === normalizedChangeLogPath)

    if (filtered.length == 0) {
        throw new Error(missingUpdateErrorMessage)
    }
    return filtered[0]
}

// async function validateLatestVersion(token, expectedLatestVersion, versionPattern, changelogUrl) {
//     core.debug(`Downloading changelog from ${changelogUrl}`)
//     const response = await octokit.request(`GET ${changelogUrl}`, {
//         changelogUrl: changelogUrl
//     })
//     core.debug(`Downloaded changelog from ${changelogUrl}`)

//     const versions = versionExtractor.getVersions(versionPattern, response.data)
//     let latest = versions[0]
//     if (latest.toUpperCase() == "UNRELEASED") {
//         latest = versions[1]
//     }
//     if (latest != expectedLatestVersion) {
//         throw new Error(`The latest version in the changelog does not match the expected latest version of ${expectedLatestVersion}!`)
//     }
// }

