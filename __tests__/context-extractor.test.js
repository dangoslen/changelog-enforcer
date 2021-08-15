const contextExtractor = require('../src/context-extractor')
const core = require('@actions/core')

const PULL = {
    key: 'value'
}

const CONTEXT_PULL = {
    eventName: 'pull_request',
    payload: {
        pull_request: PULL
    }
}

const CONTEXT_PUSH = {
    eventName: 'push',
    payload: {}
}

let warnSpy;

describe('the context-extractor', () => {

  afterAll(() => {
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    jest.clearAllMocks()

    warnSpy = jest.spyOn(core, 'warning').mockImplementation(jest.fn())
  })

  it('will return the pull request context', () => {
    const pull = contextExtractor.getPullRequestContext(CONTEXT_PULL)

    expect(pull).toBe(PULL)
  })

  it('will error if not pull request context', () => {
    const cntxt = contextExtractor.getPullRequestContext(CONTEXT_PUSH)

    expect(cntxt).toBe(undefined)
    expect(warnSpy.mock.calls.length).toBe(1)
  })
})
