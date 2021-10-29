const core = require('@actions/core')
const github = require('@actions/github')
const exec = require('@actions/exec')
const versionExtractor = require('./version-extractor')
const labelExtractor = require('./label-extractor')
const contextExtractor = require('./context-extractor')

// Input keys
const IN_CHANGELOG_PATH = 'changeLogPath'
const IN_EXPECTED_LATEST_VERSION = 'expectedLatestVersion'
const IN_VERSION_PATTERN = 'versionPattern'
const IN_UPDATE_CUSTOM_ERROR = 'missingUpdateErrorMessage'
const IN_SKIP_LABELS = 'skipLabels'
const ENV_TOKEN = "GITHUB_TOKEN"

// Output keys
const OUT_ERROR_MESSAGE = 'errorMessage'

module.exports.enforce = async function () {
    try {
        const skipLabelList = getSkipLabels()
        const changeLogPath = core.getInput(IN_CHANGELOG_PATH)
        const missingUpdateErrorMessage = getMissingUpdateErrorMessage(changeLogPath)
        const expectedLatestVersion = core.getInput(IN_EXPECTED_LATEST_VERSION)
        const versionPattern = core.getInput(IN_VERSION_PATTERN)
        const token = core.getInput(ENV_TOKEN)

        core.info(`Skip Labels: ${skipLabelList}`)
        core.info(`Changelog Path: ${changeLogPath}`)
        core.info(`Missing Update Error Message: ${missingUpdateErrorMessage}`)
        core.info(`Expected Latest Version: ${expectedLatestVersion}`)
        core.info(`Version Pattern: ${versionPattern}`)

        const octokit = github.getOctokit(token)
        const context = github.context
        const pullRequest = contextExtractor.getPullRequestContext(context)
        if (!pullRequest) {
            return
        }

        const labelNames = pullRequest.labels.map(l => l.name)
        if (!shouldEnforceChangelog(labelNames, skipLabelList)) {
            return
        }

        await checkChangeLog(octokit, pullRequest, changeLogPath, missingUpdateErrorMessage)
        // await validateLatestVersion(expectedLatestVersion, versionPattern, changeLogPath)
    } catch (error) {
        core.setOutput(OUT_ERROR_MESSAGE, error.message)
        core.setFailed(error.message)
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

async function checkChangeLog(octokit, pull_request, changeLogPath, missingUpdateErrorMessage) {
    core.debug("Downloading pull request files")
    const response = await octokit.request('GET /repos/{repo}/pulls/{pull_number}/files', {
        repo: pull_request.repo,
        pull_number: pull_request.number
    })
    core.debug("Downloaded pull request files")

    let normalizedChangeLogPath = changeLogPath
    if (normalizedChangeLogPath.startsWith('./')) {
        normalizedChangeLogPath = normalizedChangeLogPath.substring(2)
    }

    core.debug("Filtering for changelog")
    const changelogFile = response.files
        .filter(f => f.status != 'deleted')
        .filter(f => f.filename == normalizedChangeLogPath)
        .map(f => { f.filename, f.raw_url })

    if (!changelogFile) {
        throw new Error(missingUpdateErrorMessage)
    }
}

async function validateLatestVersion(expectedLatestVersion, versionPattern, changelogFile) {
    if (expectedLatestVersion == null || expectedLatestVersion.length == 0) {
        return
    }

    const versions = versionExtractor.getVersions(versionPattern, changeLogPath)
    let latest = versions[0]
    if (latest.toUpperCase() == "UNRELEASED") {
        latest = versions[1]
    }
    if (latest != expectedLatestVersion) {
        throw new Error(`The latest version in the changelog does not match the expected latest version of ${expectedLatestVersion}!`)
    }
}

