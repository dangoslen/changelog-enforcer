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
            await ensureBranchExists(baseRef)
            await checkChangeLog(baseRef, changeLogPath)
        }
    } catch(error) {
        core.setFailed(error.message);
    }
};

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
        const branchName = change.replace(/(^\s*[\w+/-]*)(\s*)([\w+].*)\n?$/g, '$1')
        branchNames.push(branchName)
    })

    if (!branchNames.includes(`remotes/origin/${baseRef}`)) {
        await exec.exec('git', ['fetch', `origin ${baseRef}`], {})
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

