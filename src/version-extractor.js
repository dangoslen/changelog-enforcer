const fs = require('fs')

module.exports.getVersions = function (pattern, changelog) {
    const regex = new RegExp(`${pattern}`, 'gm')
    let groups = false
    let versions = []
    do {
        groups = regex.exec(changelog)
        if (groups) {
            // The actual group we want to match is the version
            versions.push(groups[1])
        }
    } while (groups)
    return versions
}