const core = require('@actions/core')
const exec = require('@actions/exec')
const changelogEnforcer = require('../src/changelog-enforcer')

// Inputs for mock @actions/core
let inputs = {}

describe('changelog-enforcer tests', () => {
  
  afterAll(() => {
    // Restore
    jest.restoreAllMocks()
  })

  it('skips when label is present', () => {
    // Mock getInput
    inputs['skipLabel'] = 'Skip-Changelog' 
    inputs['changeLogPath'] = 'CHANGELOG.md' 

    const inputSpy = jest.spyOn(core, 'getInput').mockImplementation((name) => {
        return inputs[name]
    })
    const debugMock = jest.fn()
    const logSpy = jest.spyOn(core, 'info').mockImplementation(debugMock)

    const execMock = jest.fn((...args) => 0)
    const execSpy = jest.spyOn(exec, 'exec').mockImplementation(execMock)
    
    changelogEnforcer.enforce()

    expect(inputSpy).toHaveBeenCalled()
    expect(logSpy).toHaveBeenCalled()
    expect(execSpy).not.toHaveBeenCalled()

    expect(debugMock.mock.calls.length).toBe(2)
  })
})