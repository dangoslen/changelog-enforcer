const path = require('path')
const eventPath = path.resolve(__dirname, 'test_pull_request.json')
process.env.GITHUB_EVENT_PATH = eventPath
