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

// Output keys
const OUT_ERROR_MESSAGE = 'errorMessage'

module.exports.enforce = async function() {
    try {
        const skipLabelList = getSkipLabels()
        const changeLogPath = core.getInput(IN_CHANGELOG_PATH)
        const missingUpdateErrorMessage = getMissingUpdateErrorMessage(changeLogPath)
        const expectedLatestVersion = core.getInput(IN_EXPECTED_LATEST_VERSION)
        const versionPattern = core.getInput(IN_VERSION_PATTERN)

        core.info(`Skip Labels: ${skipLabelList}`)
        core.info(`Changelog Path: ${changeLogPath}`)
        core.info(`Missing Update Error Message: ${missingUpdateErrorMessage}`)
        core.info(`Expected Latest Version: ${expectedLatestVersion}`)
        core.info(`Version Pattern: ${versionPattern}`)

        const pullRequest = contextExtractor.getPullRequestContext(github.context)
        if (!pullRequest) {
            return
        }

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
        // Depth=0 needed to do `...` compare
        await exec.exec('git', ['-c', 'protocol.version=2', 'fetch', '--depth=0', 'origin', `${baseRef}`], {})
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
    
    // Use `...` to show changes from commits ONLY on the current branch
    //   git diff [<options>] <commit>...<commit> [--] [<path>...]
    //     This form is to view the changes on the branch containing and up to the second <commit>, starting at a common ancestor of both <commit>.  
    //     git diff A...B is equivalent to git diff $(git merge-base A B) B. You can omit any one of
    //     <commit>, which has the same effect as using HEAD instead.
    // For more, see https://stackoverflow.com/a/463027
    await exec.exec('git', ['diff', `origin/${baseRef}...`, '--name-status', '--diff-filter=AM'], options)

    const changes = output.split(/\r?\n/)
    let fileNames = []
    changes.map(change => {
        const fileName = change.replace(/(^[A-Z])(\s*)(.*)(\n)?$/g, '$3')
        fileNames.push(fileName)
    })

    let normalizedChangeLogPath = changeLogPath
    if (normalizedChangeLogPath.startsWith('./')) {
        normalizedChangeLogPath = normalizedChangeLogPath.substring(2)
    }
    if (!fileNames.includes(normalizedChangeLogPath)) {
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

