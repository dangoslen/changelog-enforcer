const core = require('@actions/core')
const exec = require('@actions/exec')
const changelogEnforcer = require('../src/changelog-enforcer')

// Inputs for mock @actions/core
let inputs = {}

// Core and exec mocks
const infoMock = jest.fn()
const debugMock = jest.fn()
const statusMock = jest.fn()
const execMock = jest.fn()

describe('the changelog-enforcer', () => {
  
  beforeAll(() => {
    jest.spyOn(core, 'info').mockImplementation(infoMock)
    jest.spyOn(core, 'debug').mockImplementation(debugMock)
    jest.spyOn(core, 'setFailed').mockImplementation(statusMock)

    jest.spyOn(exec, 'exec').mockImplementation(execMock)

    jest.spyOn(core, 'getInput').mockImplementation((name) => {
      return inputs[name]
    })
  })

  afterAll(() => {
    // Restore
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should skip enforcing when label is present', () => {
    // Mock getInput
    inputs['skipLabel'] = 'Skip-Changelog' 
    inputs['changeLogPath'] = 'CHANGELOG.md' 

    changelogEnforcer.enforce()

    expect(infoMock.mock.calls.length).toBe(2)
    expect(execMock.mock.calls.length).toBe(0)
  })

  it('should enforce when label is not present', () => {
    // Mock getInput
    inputs['skipLabel'] = 'A different label' 
    inputs['changeLogPath'] = 'CHANGELOG.md' 

    changelogEnforcer.enforce()

    expect(infoMock.mock.calls.length).toBe(2)
    expect(execMock.mock.calls.length).toBe(1)

    const command = execMock.mock.calls[0][0]
    expect(command).toBe(`git diff origin/master --name-only | grep 'CHANGELOG.md'`)
  })

  it('should enforce a different changelog path', () => {
    // Mock getInput
    inputs['skipLabel'] = 'A different label' 
    inputs['changeLogPath'] = './an/alternate/path/to/changelog' 

    changelogEnforcer.enforce()

    expect(infoMock.mock.calls.length).toBe(2)
    expect(execMock.mock.calls.length).toBe(1)

    const command = execMock.mock.calls[0][0]
    expect(command).toBe(`git diff origin/master --name-only | grep './an/alternate/path/to/changelog'`)
  })

  it('should set the status when something fails', () => {
    // Mock getInput
    inputs['skipLabel'] = 'A different label' 
    inputs['changeLogPath'] = './an/alternate/path/to/changelog' 

    jest.spyOn(exec, 'exec').mockImplementation((...args) => {
      throw new Error('a message');
    })

    changelogEnforcer.enforce()

    expect(infoMock.mock.calls.length).toBe(2)
    expect(statusMock.mock.calls.length).toBe(1)

    const message = statusMock.mock.calls[0][0]
    expect(message).toBe(`a message`)
  })
})