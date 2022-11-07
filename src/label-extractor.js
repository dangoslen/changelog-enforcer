module.exports.extractLabels = function (labelsString) {
    // Parses a list of labels. 
    //
    // A label can be of any length of string with the following characters
    // * Matches words (\w), 
    // * Whitespace characters (\s), 
    // * Dashes (-), 
    // * Plus signs (+), 
    // * Questions marks (\?), 
    // * Semi-colons (;), 
    // * Brackets (\[\]) 
    // * Parenthesis (\(\))
    // Each match may are may not have a trailing comma (,?). 
    // If a comman exists, it is removed before appending it to the list
    const regex = new RegExp(/([\w\s-+\?;\[\]\(\)]+,?)/, 'g')
    let labels = []
    let groups
    do {
        groups = regex.exec(labelsString)
        if (groups) {
            // Removes the trailing comma and removes all whitespace
            let label = groups[0].replace(",", "").trim()
            labels.push(label)
        }
    } while(groups)
    return labels
}