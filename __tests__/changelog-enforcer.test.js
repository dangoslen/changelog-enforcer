jest.mock('node-fetch');

const core = require('@actions/core')
const fetch = require('node-fetch')
const { Response } = jest.requireActual('node-fetch');
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
  })

  prepareResponse = (body) => {
    return Promise.resolve(new Response(body, { Headers: { 'Content-Type': 'application/json' } }))
  }

  it('should skip enforcing when label is present', (done) => {
    changelogEnforcer.enforce()
      .then(() => {
        expect(infoSpy).toHaveBeenCalledTimes(5)
        expect(failureSpy).not.toHaveBeenCalled()
        expect(outputSpy).not.toHaveBeenCalled()

        done()
      })
  })

  it('should throw an error when token is missing', (done) => {
    inputs['token'] = ''

    changelogEnforcer.enforce()
      .then(() => {
        expect(infoSpy).not.toHaveBeenCalled()
        expect(failureSpy).toHaveBeenCalled()
        expect(outputSpy).toHaveBeenCalled()

        done()
      })
  })

  it('should enforce when label is not present; changelog is changed', (done) => {
    inputs['skipLabels'] = 'A different label'

    const files = [
      {
        "filename": "CHANGELOG.md",
        "status": "modified",
        "contents_url": "./path/to/CHANGELOG.md"
      }
    ]

    fetch.mockImplementation((url, options) => {
      return prepareResponse(JSON.stringify(files))
    })

    changelogEnforcer.enforce()
      .then(() => {
        expect(infoSpy).toHaveBeenCalledTimes(5)
        expect(failureSpy).not.toHaveBeenCalled()
        expect(outputSpy).not.toHaveBeenCalled()

        expect(fetch).toHaveBeenCalledTimes(1)

        done()
      })
  })

  it('should enforce when label is not present; changelog is not changed', (done) => {
    inputs['skipLabels'] = 'A different label'

    const files = [
      {
        "filename": "AnotherFile.md",
        "status": "modified",
        "contents_url": "/path/to/AnotherFile.md"
      }
    ]


    fetch.mockImplementation((url, options) => {
      return prepareResponse(JSON.stringify(files))
    })

    changelogEnforcer.enforce()
      .then(() => {
        expect(infoSpy).toHaveBeenCalledTimes(5)
        expect(failureSpy).toHaveBeenCalled()
        expect(outputSpy).toHaveBeenCalled()

        expect(fetch).toHaveBeenCalledTimes(1)

        done()
      })
  })

  it('should enforce when label is not present; changelog is not changed; custom error message', (done) => {
    const customErrorMessage = 'Some Message for you @Author!'
    inputs['skipLabels'] = 'A different label'
    inputs['missingUpdateErrorMessage'] = customErrorMessage

    const files = [
      {
        "filename": "AnotherFile.md",
        "status": "modified",
        "contents_url": "/path/to/AnotherFile.md"
      }
    ]

    fetch.mockImplementation((url, options) => {
      return prepareResponse(JSON.stringify(files))
    })

    changelogEnforcer.enforce()
      .then(() => {
        expect(infoSpy).toHaveBeenCalledTimes(5)
        expect(failureSpy).toHaveBeenCalled()
        expect(outputSpy).toHaveBeenCalledWith('errorMessage', customErrorMessage)

        expect(fetch).toHaveBeenCalledTimes(1)

        done()
      })
  })

  it('should enforce when label is not present; changelog is changed; versions do not match', (done) => {
    const contentsUrl = 'some-url'
    inputs['skipLabels'] = 'A different label'
    inputs['expectedLatestVersion'] = 'v2.0.0'

    const files = [
      {
        "filename": "CHANGELOG.md",
        "status": "modified",
        "contents_url": contentsUrl
      }
    ]

    const changelog =
      `## [v2.1.0]
    - Changelog   
`

    fetch.mockImplementation((url, options) => {
      if (url === contentsUrl) {
        return Promise.resolve(new Response(changelog))
      }
      return prepareResponse(JSON.stringify(files))
    })

    changelogEnforcer.enforce()
      .then(() => {
        expect(infoSpy).toHaveBeenCalledTimes(5)
        expect(failureSpy).toHaveBeenCalled()
        expect(outputSpy).toHaveBeenCalled()

        expect(fetch).toHaveBeenCalledTimes(2)

        done()
      })
  })

  it('should enforce when label is not present; changelog is changed; only one unreleased version exists', (done) => {
    const contentsUrl = 'some-url'
    inputs['skipLabels'] = 'A different label'
    inputs['expectedLatestVersion'] = 'v2.0.0'

    const files = [
      {
        "filename": "CHANGELOG.md",
        "status": "modified",
        "contents_url": contentsUrl
      }
    ]

    const changelog =
      `## [Unreleased]
    - Changelog   
`

    fetch.mockImplementation((url, options) => {
      if (url === contentsUrl) {
        return Promise.resolve(new Response(changelog))
      }
      return prepareResponse(JSON.stringify(files))
    })

    changelogEnforcer.enforce()
      .then(() => {
        expect(infoSpy).toHaveBeenCalledTimes(5)
        expect(failureSpy).not.toHaveBeenCalled()
        expect(outputSpy).not.toHaveBeenCalled()

        expect(fetch).toHaveBeenCalledTimes(2)

        done()
      })
  })
})