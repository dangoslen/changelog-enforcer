const fs = require('fs')
const versionExtractor = require('../src/version-extractor')

const KEEP_A_CHANGELOG = `
## Unreleased

## [v1.10.0]
- Some changes

## [v1.9.2]
Fixed a bug
`

const CUSTOM = `
* Unreleased

* v1.2.0
- Some changes
`
const CHANGELOG = "CHANGELOG.md"
const VERSION_PATTERN = "^## \\[?((v|V)?\\d*\\.\\d*\\.\\d*-?\\w*|unreleased|Unreleased|UNRELEASED)\\]?"
const CUSTOM_VERSION_PATTERN = "^\\* ((v|V)?\\d*\\.\\d*\\.\\d*-?\\w*|Unreleased)"

describe('the verstion-extractor', () => {

  afterAll(() => {
    // Restore
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return all versions via keep a changelog format', () => {
    const readFileSync = jest.spyOn(fs, 'readFileSync').mockImplementation((path, encoding) => {
      if (encoding == 'utf8' && path == CHANGELOG) {
        return KEEP_A_CHANGELOG
      }
    })
  
    const versions = versionExtractor.getVersions(VERSION_PATTERN, CHANGELOG)

    expect(versions).toStrictEqual(['Unreleased', 'v1.10.0', 'v1.9.2'])
  })

  it('should return all versions via custom format', () => {
    const readFileSync = jest.spyOn(fs, 'readFileSync').mockImplementation((path, encoding) => {
      if (encoding == 'utf8' && path == CHANGELOG) {
        return CUSTOM
      }
    })
  
    const versions = versionExtractor.getVersions(CUSTOM_VERSION_PATTERN, CHANGELOG)

    expect(versions).toStrictEqual(['Unreleased', 'v1.2.0'])
  })

})