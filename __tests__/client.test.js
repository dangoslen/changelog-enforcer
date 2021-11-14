jest.mock('node-fetch');

const core = require('@actions/core')
const fetch = require('node-fetch')
const { Response } = jest.requireActual('node-fetch');
const client = require('../src/client')

describe('the client', () => {

  afterAll(() => {
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  prepareResponse = (body) => {
    return Promise.resolve(new Response(body, { Headers: { 'Content-Type': 'application/json' } }))
  }

  it('should find the change file', async () => {
    const files = [
      {
        "filename": "CHANGELOG.md",
        "status": "modified",
        "raw_url": "./path/to/CHANGELOG.md"
      }
    ]

    fetch.mockReturnValueOnce(prepareResponse(JSON.stringify(files)))

    const changelogFile = await client.findChangelog('token', 'repo', 1, 1, 'CHANGELOG.md')
    expect(fetch).toHaveBeenCalled()
    expect(changelogFile).toStrictEqual({
      "filename": "CHANGELOG.md",
      "status": "modified",
      "raw_url": "./path/to/CHANGELOG.md"
    })
  })

  it('should not find the change file', async () => {
    const firstPage = [
      {
        "filename": "random.md",
        "status": "modified",
        "raw_url": "./path/to/random.md"
      }
    ]

    const secondPage = []

    fetch
      .mockReturnValueOnce(prepareResponse(JSON.stringify(firstPage)))
      .mockReturnValueOnce(prepareResponse(JSON.stringify(secondPage)))

    const changelogFile = await client.findChangelog('token', 'repo', 1, 1, 'CHANGELOG.md')
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(changelogFile).toBeUndefined()
  })
})