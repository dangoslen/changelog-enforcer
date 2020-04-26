const path = require('path')
const eventPath = path.resolve(__dirname, 'pull_request.json')
process.env.GITHUB_EVENT_PATH = eventPath
