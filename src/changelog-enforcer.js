const core = require('@actions/core')
const github = require('@actions/github')
const exec = require('@actions/exec')
const versionExtractor = require('./version-extractor')
const labelExtractor = require('./label-extractor')

// Input keys
const IN_CHANGELOG_PATH = 'changeLogPath'
const IN_EXPECTED_LATEST_VERSION = 'expectedLatestVersion'
const IN_VERSION_PATTERN = 'versionPattern'
const IN_UPDATE_CUSTOM_ERROR = 'missingUpdateErrorMessage'
const IN_SKIP_LABEL = 'skipLabel'
const IN_SKIP_LABELS = 'skipLabels'

// Output keys
const OUT_ERROR_MESSAGE = 'errorMessage'

const LABELS_WARNING_MESSAGE =
`The skipLabel input variable is deprecated and will be removed in a future release. \
Please use the skipLabels input variable instead.`

module.exports.enforce = async function() {
    try {
        const skipLabelList = getLabels()
        const changeLogPath = core.getInput(IN_CHANGELOG_PATH)
        const missingUpdateErrorMessage = getMissingUpdateErrorMessage(changeLogPath)
        const expectedLatestVersion = core.getInput(IN_EXPECTED_LATEST_VERSION)
        const versionPattern = core.getInput(IN_VERSION_PATTERN)

        core.info(`Skip Labels: ${skipLabelList}`)
        core.info(`Changelog Path: ${changeLogPath}`)
        core.info(`Missing Update Error Message: ${missingUpdateErrorMessage}`)
        core.info(`Expected Latest Version: ${expectedLatestVersion}`)
        core.info(`Version Pattern: ${versionPattern}`)

        const pullRequest = github.context.payload.pull_request
        const labelNames = pullRequest.labels.map(l => l.name)
        const baseRef = pullRequest.base.ref

        if (shouldEnforceChangelog(labelNames, skipLabelList)) {
            await ensureBranchExists(baseRef)
            await checkChangeLog(baseRef, changeLogPath, missingUpdateErrorMessage)
            await validateLatestVersion(expectedLatestVersion, versionPattern, changeLogPath)
        }
    } catch(error) {
        core.setOutput(OUT_ERROR_MESSAGE, error.message)
        core.setFailed(error.message)
    }
};

function getLabels() {
    const skipLabel = core.getInput(IN_SKIP_LABEL)
    const skipLabels = core.getInput(IN_SKIP_LABELS)
    if (skipLabel != '') {
        core.warning(LABELS_WARNING_MESSAGE)
        return [skipLabel]
    } 
    return labelExtractor.getLabels(skipLabels)
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

async function ensureBranchExists(baseRef) {
    let output = ''
    const options = {}
    options.listeners = {
        stdout: (data) => {
            output += data.toString();
        }
    }

    await exec.exec('git', ['branch', '--verbose', '--all'], options)

    const branches = output.split(/\r?\n/)
    let branchNames = []
    branches.map(change => {
        const branchName = change.replace(/(^\s*[\.\w+/-]*)(\s*)([\w+].*)\n?$/g, '$1').trim()
        branchNames.push(branchName)
    })

    if (!branchNames.includes(`remotes/origin/${baseRef}`)) {
        await exec.exec('git', ['-c', 'protocol.version=2', 'fetch', '--depth=1', 'origin', `${baseRef}`], {})
    }
}

async function checkChangeLog(baseRef, changeLogPath, missingUpdateErrorMessage) {
    let output = ''
    const options = {}
    options.listeners = {
        stdout: (data) => {
            output += data.toString();
        }
    }
    
    await exec.exec('git', ['diff', `origin/${baseRef}`, '--name-status', '--diff-filter=AM'], options)

    const changes = output.split(/\r?\n/)
    let fileNames = []
    changes.map(change => {
        const fileName = change.replace(/(^[A-Z])(\s*)(.*)(\n)?$/g, '$3')
        fileNames.push(fileName)
    })
    

    if (!fileNames.includes(changeLogPath)) {
        throw new Error(missingUpdateErrorMessage)
    }
}

async function validateLatestVersion(expectedLatestVersion, versionPattern, changeLogPath) {
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

