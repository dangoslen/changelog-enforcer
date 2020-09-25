const core = require('@actions/core')
const exec = require('@actions/exec')
const changelogEnforcer = require('../src/changelog-enforcer')

// Inputs for mock @actions/core
let inputs = {}

describe('the changelog-enforcer', () => {

  afterAll(() => {
    // Restore
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    jest.clearAllMocks()

    jest.spyOn(core, 'getInput').mockImplementation((name) => {
      return inputs[name]
    })
  })

  it('should skip enforcing when label is present', (done) => {
    // Mock getInput
    inputs['skipLabel'] = 'Skip-Changelog' 
    inputs['changeLogPath'] = 'CHANGELOG.md' 

    const infoSpy = jest.spyOn(core, 'info').mockImplementation(jest.fn())
    const failureSpy = jest.spyOn(core, 'error').mockImplementation(jest.fn())
    const execSpy = jest.spyOn(exec, 'exec').mockImplementation((command, args, options) => { return 0 })

    changelogEnforcer.enforce()
    .then(() => {
      expect(infoSpy.mock.calls.length).toBe(2)
      expect(execSpy).not.toHaveBeenCalled()
      expect(failureSpy).not.toHaveBeenCalled()

      done()
    })
  })

  it('should enforce when label is not present; changelog is not present; branch checked out', (done) => {
    // Mock getInput
    inputs['skipLabel'] = 'A different label' 
    inputs['changeLogPath'] = 'CHANGELOG.md' 

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
      expect(infoSpy.mock.calls.length).toBe(2)
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
  
  it('should enforce when label is not present; changelog is present; branch not checked out', (done) => {
    // Mock getInput
    inputs['skipLabel'] = 'A different label' 
    inputs['changeLogPath'] = 'CHANGELOG.md' 

    const infoSpy = jest.spyOn(core, 'info').mockImplementation(jest.fn())
    const failureSpy = jest.spyOn(core, 'setFailed').mockImplementation(jest.fn())
    const execSpy = jest.spyOn(exec, 'exec').mockImplementation((command, args, options) => {
      if (args[1] == 'fetch') {
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
      expect(infoSpy.mock.calls.length).toBe(2)
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