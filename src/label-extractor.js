module.exports.getLabels = function (labelsString) {
    // Matches words (\w), dashes (-), plus signs (+), questions marks (\?), semi-colons (;), brackets (\[\]) and parenthesis (\(\))
    // Leaves the trailing comma if there is one and is removed when parsing each group matched
    const regex = new RegExp(/([\w-+\?;\[\]\(\)])+(,?)/, 'g')
    let labels = []
    do {
        groups = regex.exec(labelsString)
        if (groups) {
            // Removes the trailing comma and removes all whitespace
            label = groups[0].replace(",", "").trim()
            labels.push(label)
        }
    } while(groups)
    return labels
}