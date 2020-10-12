const fs = require('fs')

module.exports.getVersions = function (pattern, changeLogPath) {
    const regex = new RegExp(`${pattern}`, 'gm')
    const changelog = fs.readFileSync(changeLogPath, 'utf8')
    let version = false
    let versions = []
    do {
        version = regex.exec(changelog)
        // The actual group we want to match is the version
        versions.push(version[1])
    } while(version)
    return versions
}