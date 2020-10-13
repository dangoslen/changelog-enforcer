const core = require('@actions/core')
const exec = require('@actions/exec')
const versionExtractor = require('../src/version-extractor')
const changelogEnforcer = require('../src/changelog-enforcer')

const SKIP_LABEL = "Skip-Changelog"
const CHANGELOG = "CHANGELOG.md"
const VERSION_PATTERN = "^## \\[((v|V)?\\d*\\.\\d*\\.\\d*-?\\w*|unreleased|Unreleased|UNRELEASED)\\]"

// Inputs for mock @actions/core
let inputs = {}

describe('the changelog-enforcer', () => {

  afterAll(() => {
    // Restore
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    jest.clearAllMocks()

    inputs['skipLabel'] = SKIP_LABEL
    inputs['changeLogPath'] = CHANGELOG
    inputs['expectedLatestVersion'] = '' 
    inputs['versionPattern'] = VERSION_PATTERN

    jest.spyOn(core, 'getInput').mockImplementation((name) => {
      return inputs[name]
    })
  })

  it('should skip enforcing when label is present', (done) => {
    const infoSpy = jest.spyOn(core, 'info').mockImplementation(jest.fn())
    const failureSpy = jest.spyOn(core, 'error').mockImplementation(jest.fn())
    const execSpy = jest.spyOn(exec, 'exec').mockImplementation((command, args, options) => { return 0 })

    changelogEnforcer.enforce()
    .then(() => {
      expect(infoSpy.mock.calls.length).toBe(4)
      expect(execSpy).not.toHaveBeenCalled()
      expect(failureSpy).not.toHaveBeenCalled()

      done()
    })
  })

  it('should enforce when label is not present; changelog is changed; branch checked out; latest version does not match', (done) => {
    // Mock getInput
    inputs['skipLabel'] = 'A different label' 
    inputs['expectedLatestVersion'] = 'v1.10'

    const infoSpy = jest.spyOn(core, 'info').mockImplementation(jest.fn())
    const failureSpy = jest.spyOn(core, 'setFailed').mockImplementation(jest.fn())
    const execSpy = jest.spyOn(exec, 'exec').mockImplementation((command, args, options) => {
      let stdout = ''
      if (args[0] == 'diff') {
        stdout = 
`M      CHANGELOG.md
A       an_added_changed_file.js`
      }
      if (args[0] == 'branch') {
        stdout =
` * (HEAD detached at pull/27/merge) 6a67f6e Merge 
    remotes/origin/master somecommithash
    remotes/origin/changes someotherhash`
      }
      options.listeners.stdout(stdout)
      return 0
    })

    const versionSpy = jest.spyOn(versionExtractor, 'getVersions').mockImplementation((pattern, path) => {
      return ['v1.11', 'v1.10']
    })

    changelogEnforcer.enforce()
    .then(() => {
      expect(infoSpy.mock.calls.length).toBe(4)
      expect(execSpy.mock.calls.length).toBe(2)
      expect(versionSpy.mock.calls.length).toBe(1)
      expect(failureSpy).toHaveBeenCalled()

      const command_branch = execSpy.mock.calls[0][0]
      const command_branch_args = execSpy.mock.calls[0][1].join(' ')
      expect(command_branch).toBe('git')
      expect(command_branch_args).toBe('branch --verbose --all')

      const command_diff = execSpy.mock.calls[1][0]
      const command_diff_args = execSpy.mock.calls[1][1].join(' ')
      expect(command_diff).toBe('git')
      expect(command_diff_args).toBe('diff origin/master --name-status --diff-filter=AM')
      
      done()
    })
  })

  it('should not enforce when label is not present; changelog is changed; branch checked out; latest version is Unreleased', (done) => {
    // Mock getInput
    inputs['skipLabel'] = 'A different label' 
    inputs['expectedLatestVersion'] = 'v1.10'

    const infoSpy = jest.spyOn(core, 'info').mockImplementation(jest.fn())
    const failureSpy = jest.spyOn(core, 'setFailed').mockImplementation(jest.fn())
    const execSpy = jest.spyOn(exec, 'exec').mockImplementation((command, args, options) => {
      let stdout = ''
      if (args[0] == 'diff') {
        stdout = 
`M       .env.js
M       CHANGELOG.md
A       an_added_changed_file.js`
      }
      if (args[0] == 'branch') {
        stdout =
` * (HEAD detached at pull/27/merge) 6a67f6e Merge 
    remotes/origin/master somecommithash
    remotes/origin/changes someotherhash`
      }
      options.listeners.stdout(stdout)
      return 0
    })

    const versionSpy = jest.spyOn(versionExtractor, 'getVersions').mockImplementation((pattern, path) => {
      return ['Unreleased', 'v1.10']
    })

    changelogEnforcer.enforce()
    .then(() => {
      expect(infoSpy.mock.calls.length).toBe(4)
      expect(execSpy.mock.calls.length).toBe(2)
      expect(versionSpy.mock.calls.length).toBe(1)
      expect(failureSpy).not.toHaveBeenCalled()

      const command_branch = execSpy.mock.calls[0][0]
      const command_branch_args = execSpy.mock.calls[0][1].join(' ')
      expect(command_branch).toBe('git')
      expect(command_branch_args).toBe('branch --verbose --all')

      const command_diff = execSpy.mock.calls[1][0]
      const command_diff_args = execSpy.mock.calls[1][1].join(' ')
      expect(command_diff).toBe('git')
      expect(command_diff_args).toBe('diff origin/master --name-status --diff-filter=AM')
      
      done()
    })
  })

  it('should enforce when label is not present; changelog is not changed; branch checked out', (done) => {
    // Mock getInput
    inputs['skipLabel'] = 'A different label' 

    const infoSpy = jest.spyOn(core, 'info').mockImplementation(jest.fn())
    const failureSpy = jest.spyOn(core, 'setFailed').mockImplementation(jest.fn())
    const execSpy = jest.spyOn(exec, 'exec').mockImplementation((command, args, options) => {
      let stdout = ''
      if (args[0] == 'diff') {
        stdout = 
`M       .env.js
A       an_added_changed_file.js`
      }
      if (args[0] == 'branch') {
        stdout =
` * (HEAD detached at pull/27/merge) 6a67f6e Merge 
    remotes/origin/master somecommithash
    remotes/origin/changes someotherhash`
      }
      options.listeners.stdout(stdout)
      return 0
    })

    changelogEnforcer.enforce()
    .then(() => {
      expect(infoSpy.mock.calls.length).toBe(4)
      expect(execSpy.mock.calls.length).toBe(2)
      expect(failureSpy).toHaveBeenCalled()

      const command_branch = execSpy.mock.calls[0][0]
      const command_branch_args = execSpy.mock.calls[0][1].join(' ')
      expect(command_branch).toBe('git')
      expect(command_branch_args).toBe('branch --verbose --all')

      const command_diff = execSpy.mock.calls[1][0]
      const command_diff_args = execSpy.mock.calls[1][1].join(' ')
      expect(command_diff).toBe('git')
      expect(command_diff_args).toBe('diff origin/master --name-status --diff-filter=AM')
      
      done()
    })
  })
  
  it('should enforce when label is not present; changelog is changed; branch not checked out', (done) => {
    // Mock getInput
    inputs['skipLabel'] = 'A different label' 

    const infoSpy = jest.spyOn(core, 'info').mockImplementation(jest.fn())
    const failureSpy = jest.spyOn(core, 'setFailed').mockImplementation(jest.fn())
    const execSpy = jest.spyOn(exec, 'exec').mockImplementation((command, args, options) => {
      if (args[2] == 'fetch') {
        return 0
      }
      
      let stdout = ''
      if (args[0] == 'diff') {
        stdout = 
`M       .env.js
M       CHANGELOG.md`
      }
      if (args[0] == 'branch') {
        stdout =
` * (HEAD detached at pull/27/merge) 6a67f6e Merge 
    pull/27/merge  6a67f6f`
      }
      options.listeners.stdout(stdout)
      return 0
    })

    changelogEnforcer.enforce()
    .then(() => {
      expect(infoSpy.mock.calls.length).toBe(4)
      expect(execSpy.mock.calls.length).toBe(3)
      expect(failureSpy).not.toHaveBeenCalled()

      const command_branch = execSpy.mock.calls[0][0]
      const command_branch_args = execSpy.mock.calls[0][1].join(' ')
      expect(command_branch).toBe('git')
      expect(command_branch_args).toBe('branch --verbose --all')

      const command_fetch = execSpy.mock.calls[1][0]
      const command_fetch_args = execSpy.mock.calls[1][1].join(' ')
      expect(command_fetch).toBe('git')
      expect(command_fetch_args).toBe('-c protocol.version=2 fetch --depth=1 origin master')

      const command_diff = execSpy.mock.calls[2][0]
      const command_diff_args = execSpy.mock.calls[2][1].join(' ')
      expect(command_diff).toBe('git')
      expect(command_diff_args).toBe('diff origin/master --name-status --diff-filter=AM')

      done()
    })
  })
})