const changelogEnforcer = require('./src/changelog-enforcer')

// Looks for a label with the name from 
async function run() {
  changelogEnforcer.enforce();
}

run()
