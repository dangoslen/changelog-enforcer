const core = require('@actions/core')
const github = require('@actions/github')
const exec = require('@actions/exec')
const versionExtractor = require('./version-extractor')
const labelExtractor = require('./label-extractor')

const LABELS_WARNING_MESSAGE =
`The skipLabel input variable is deprecated and will be removed in a future release. \
Please use the skipLabels input variable instead.`

module.exports.enforce = async function() {
    try {
        const skipLabel = core.getInput('skipLabel')
        const skipLabels = core.getInput('skipLabels')
        const changeLogPath = core.getInput('changeLogPath')
        const expectedLatestVersion = core.getInput('expectedLatestVersion')
        const versionPattern = core.getInput('versionPattern')

        const skipLabelList = getLabels(skipLabel, skipLabels)

        core.info(`Skip Labels: ${skipLabelList}`)
        core.info(`Changelog Path: ${changeLogPath}`)
        core.info(`Expected Latest Version: ${expectedLatestVersion}`)
        core.info(`Version Pattern: ${versionPattern}`)

        const pullRequest = github.context.payload.pull_request
        const labelNames = pullRequest.labels.map(l => l.name)
        const baseRef = pullRequest.base.ref

        if (!shouldSkip(labelNames, skipLabelList)) {
            await ensureBranchExists(baseRef)
            await checkChangeLog(baseRef, changeLogPath)
            await validateLatestVersion(expectedLatestVersion, versionPattern, changeLogPath)
        }
    } catch(error) {
        core.setFailed(error.message);
    }
};

function getLabels(skipLabel, skipLabels) {
    if (skipLabel != '') {
        core.warning(LABELS_WARN_MESSAGE)
        return [skipLabel]
    } 
    return labelExtractor.getLabels(skipLabels)
}

function shouldSkip(labelNames, skipLabelList) {
    return labelNames.some(l => skipLabelList.includes(l))
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

async function checkChangeLog(baseRef, changeLogPath) {
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
        throw new Error(`No update to ${changeLogPath} found!`)
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

