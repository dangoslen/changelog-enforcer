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

  it('should skip enforcing when label is present', () => {
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
    })
  })

  it('should enforce when label is not present; changelog is not present', () => {
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
`(HEAD detached at hash)`
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
      expect(command_branch_args).toBe('branch')

      const command_diff = execSpy.mock.calls[1][0]
      const command_diff_args = execSpy.mock.calls[1][1].join(' ')
      expect(command_diff).toBe('git')
      expect(command_diff_args).toBe('diff origin/master --name-status --diff-filter=AM')
    })
  })

  it('should enforce when label is not present; changelog is present', () => {
    // Mock getInput
    inputs['skipLabel'] = 'A different label' 
    inputs['changeLogPath'] = 'CHANGELOG.md' 

    const infoSpy = jest.spyOn(core, 'info').mockImplementation(jest.fn())
    const failureSpy = jest.spyOn(core, 'setFailed').mockImplementation(jest.fn())
    const execSpy = jest.spyOn(exec, 'exec').mockImplementation((command, args, options) => {
      let stdout = ''
      if (args[0] == 'diff')
        stdout = 
`M       .env.js
M       CHANGELOG.md`
      if (args[0] == 'branch') {
        stdout =
      `(HEAD detached at hash)`
      }
      options.listeners.stdout(stdout)
      return 0
    })

    changelogEnforcer.enforce()
    .then(() => {
      expect(infoSpy.mock.calls.length).toBe(2)
      expect(execSpy.mock.calls.length).toBe(2)
      expect(failureSpy).not.toHaveBeenCalled()

      const command_branch = execSpy.mock.calls[0][0]
      const command_branch_args = execSpy.mock.calls[0][1].join(' ')
      expect(command_branch).toBe('git')
      expect(command_branch_args).toBe('branch')

      const command_diff = execSpy.mock.calls[1][0]
      const command_diff_args = execSpy.mock.calls[1][1].join(' ')
      expect(command_diff).toBe('git')
      expect(command_diff_args).toBe('diff origin/master --name-status --diff-filter=AM')
    })
  })
})