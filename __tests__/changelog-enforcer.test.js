const core = require('@actions/core')
const github = require('@actions/github')
const changelogEnforcer = require('../src/changelog-enforcer')

const SKIP_LABELS = "SomeLabel,Skip-Changelog,Skip-Release"
const CHANGELOG = "CHANGELOG.md"
const VERSION_PATTERN = "^## \\[((v|V)?\\d*\\.\\d*\\.\\d*-?\\w*|unreleased|Unreleased|UNRELEASED)\\]"

// Inputs for mock @actions/core
let inputs = {}

// Mocks via Jest
let infoSpy
let failureSpy
let outputSpy

describe('the changelog-enforcer', () => {

  afterAll(() => {
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    jest.clearAllMocks()

    inputs['skipLabels'] = SKIP_LABELS
    inputs['changeLogPath'] = CHANGELOG
    inputs['expectedLatestVersion'] = ''
    inputs['versionPattern'] = VERSION_PATTERN
    inputs['token'] = 'token'

    jest.spyOn(core, 'getInput').mockImplementation((name) => {
      return inputs[name]
    })

    octokit = {}

    infoSpy = jest.spyOn(core, 'info').mockImplementation(jest.fn())
    failureSpy = jest.spyOn(core, 'setFailed').mockImplementation(jest.fn())
    outputSpy = jest.spyOn(core, 'setOutput').mockImplementation(jest.fn())
    githubSpy = jest.spyOn(github, 'getOctokit').mockImplementation((token) => { return octokit })
  })

  preparePaginate = (requestLine, options, response) => {
    expect(requestLine).toBe('GET /repos/{repo}/pulls/{number}/files')
    return Promise.resolve(response)
  }

  it('should skip enforcing when label is present', (done) => {
    changelogEnforcer.enforce()
      .then(() => {
        expect(infoSpy.mock.calls.length).toBe(5)
        expect(failureSpy).not.toHaveBeenCalled()
        expect(outputSpy).not.toHaveBeenCalled()

        done()
      })
  })

  it('should enforce when label is not present; changelog is changed', (done) => {
    inputs['skipLabels'] = 'A different label'

    const response = {
      "data": [
        {
          "filename": "CHANGELOG.md",
          "status": "modified",
          "raw_url": "./path/to/CHANGELOG.md"
        }
      ]
    }

    octokit.paginate = jest.fn(async (requestLine, options) => {
      return preparePaginate(requestLine, options, response)
    })

    changelogEnforcer.enforce()
      .then(() => {
        expect(infoSpy.mock.calls.length).toBe(5)
        expect(octokit.paginate).toHaveBeenCalled()
        expect(failureSpy).not.toHaveBeenCalled()
        expect(outputSpy).not.toHaveBeenCalled()

        done()
      })
  })

  it('should enforce when label is not present; changelog is not changed', (done) => {
    inputs['skipLabels'] = 'A different label'

    const response = {
      "data": [
        {
          "filename": "AnotherFile.md",
          "status": "modified",
          "raw_url": "/path/to/AnotherFile.md"
        }
      ]
    }

    octokit.paginate = jest.fn(async (requestLine, options) => {
      return preparePaginate(requestLine, options, response)

    })

    changelogEnforcer.enforce()
      .then(() => {
        expect(infoSpy.mock.calls.length).toBe(5)
        expect(octokit.paginate).toHaveBeenCalled()
        expect(failureSpy).toHaveBeenCalled()
        expect(outputSpy).toHaveBeenCalled()

        done()
      })
  })

  it('should enforce when label is not present; changelog is not changed; custom error message', (done) => {
    const customErrorMessage = 'Some Message for you @Author!'
    inputs['skipLabels'] = 'A different label'
    inputs['missingUpdateErrorMessage'] = customErrorMessage

    const response = {
      "data": [
        {
          "filename": "AnotherFile.md",
          "status": "modified",
          "raw_url": "/path/to/AnotherFile.md"
        }
      ]
    }

    octokit.paginate = jest.fn(async (requestLine, options) => {
      return preparePaginate(requestLine, options, response)
    })

    changelogEnforcer.enforce()
      .then(() => {
        expect(infoSpy.mock.calls.length).toBe(5)
        expect(octokit.paginate).toHaveBeenCalled()
        expect(failureSpy).toHaveBeenCalled()
        expect(outputSpy).toHaveBeenCalledWith('errorMessage', customErrorMessage)

        done()
      })
  })

  //   it('should enforce when label is not present; changelog is changed; branch not checked out', (done) => {
  //     inputs['skipLabels'] = 'A different label' 

  //     execSpy = jest.spyOn(exec, 'exec').mockImplementation((command, args, options) => {
  //       if (args[2] == 'fetch') {
  //         return 0
  //       }

  //       let stdout = ''
  //       if (args[0] == 'diff') {
  //         stdout = 
  // `M       .env.js
  // M       CHANGELOG.md`
  //       }
  //       if (args[0] == 'branch') {
  //         stdout =
  // ` * (HEAD detached at pull/27/merge) 6a67f6e Merge 
  //     pull/27/merge  6a67f6f`
  //       }
  //       options.listeners.stdout(stdout)
  //       return 0
  //     })

  //     changelogEnforcer.enforce()
  //     .then(() => {
  //       expect(infoSpy.mock.calls.length).toBe(5)
  //       expect(execSpy.mock.calls.length).toBe(3)
  //       expect(failureSpy).not.toHaveBeenCalled()
  //       expect(outputSpy).not.toHaveBeenCalled()

  //       const command_branch = execSpy.mock.calls[0][0]
  //       const command_branch_args = execSpy.mock.calls[0][1].join(' ')
  //       expect(command_branch).toBe('git')
  //       expect(command_branch_args).toBe('branch --verbose --all')

  //       const command_fetch = execSpy.mock.calls[1][0]
  //       const command_fetch_args = execSpy.mock.calls[1][1].join(' ')
  //       expect(command_fetch).toBe('git')
  //       expect(command_fetch_args).toBe('-c protocol.version=2 fetch --depth=1 origin master')

  //       const command_diff = execSpy.mock.calls[2][0]
  //       const command_diff_args = execSpy.mock.calls[2][1].join(' ')
  //       expect(command_diff).toBe('git')
  //       expect(command_diff_args).toBe('diff origin/master --name-status --diff-filter=AM')

  //       done()
  //     })
  //   })

  //   it('should enforce when label is not present; changelog is changed; branch not checked out; custom path', (done) => {
  //     inputs['skipLabels'] = 'A different label' 
  //     inputs['changeLogPath'] = './path/to/CHANGELOG.md' 

  //     execSpy = jest.spyOn(exec, 'exec').mockImplementation((command, args, options) => {
  //       if (args[2] == 'fetch') {
  //         return 0
  //       }

  //       let stdout = ''
  //       if (args[0] == 'diff') {
  //         stdout = 
  // `M      .env.js
  // M       path/to/CHANGELOG.md`
  //       }
  //       if (args[0] == 'branch') {
  //         stdout =
  // ` * (HEAD detached at pull/27/merge) 6a67f6e Merge 
  //     pull/27/merge  6a67f6f`
  //       }
  //       options.listeners.stdout(stdout)
  //       return 0
  //     })

  //     changelogEnforcer.enforce()
  //     .then(() => {
  //       expect(infoSpy.mock.calls.length).toBe(5)
  //       expect(execSpy.mock.calls.length).toBe(3)
  //       expect(failureSpy).not.toHaveBeenCalled()
  //       expect(outputSpy).not.toHaveBeenCalled()

  //       const command_branch = execSpy.mock.calls[0][0]
  //       const command_branch_args = execSpy.mock.calls[0][1].join(' ')
  //       expect(command_branch).toBe('git')
  //       expect(command_branch_args).toBe('branch --verbose --all')

  //       const command_fetch = execSpy.mock.calls[1][0]
  //       const command_fetch_args = execSpy.mock.calls[1][1].join(' ')
  //       expect(command_fetch).toBe('git')
  //       expect(command_fetch_args).toBe('-c protocol.version=2 fetch --depth=1 origin master')

  //       const command_diff = execSpy.mock.calls[2][0]
  //       const command_diff_args = execSpy.mock.calls[2][1].join(' ')
  //       expect(command_diff).toBe('git')
  //       expect(command_diff_args).toBe('diff origin/master --name-status --diff-filter=AM')

  //       done()
  //     })
  //   })
})