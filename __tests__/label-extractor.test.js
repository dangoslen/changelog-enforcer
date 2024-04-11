const labelExtractor = require('../src/label-extractor')

const EXPECTED_LABELS = ['label-1','label-2_with_underscore','special-[characters](please)']
const EXPECTED_LABELS_SPACES = ['label 1','label 2_with_underscore','special [characters] (please)']
const EXPECTED_SINGLE_ENTRY = ['no changelog entry needed']

describe('the label-extractor', () => {

  it('should return all labels', () => {
    const labels = labelExtractor.extractLabels('label-1,label-2_with_underscore,special-[characters](please)')

    expect(labels).toStrictEqual(EXPECTED_LABELS)
  })

  it('should return all labels when spaces are included and trailing comma', () => {
    const labels = labelExtractor.extractLabels('label-1 ,    label-2_with_underscore   ,      special-[characters](please),')

    expect(labels).toStrictEqual(EXPECTED_LABELS)
  })

  it('should return all labels with spaces', () => {
    const labels = labelExtractor.extractLabels('label 1,label 2_with_underscore,special [characters] (please)')

    expect(labels).toStrictEqual(EXPECTED_LABELS_SPACES)
  })

  it('should return only a single labels with spaces', () => {
    const labels = labelExtractor.extractLabels('no changelog entry needed')

    expect(labels).toStrictEqual(EXPECTED_SINGLE_ENTRY)
  })

  it('should handle labels containing a forward slash', () => {
    const labels = labelExtractor.extractLabels('skip/changelog')

    expect(labels).toStrictEqual(['skip/changelog'])
  })

  it('should handle multiple labels containing a forward slash', () => {
    const labels = labelExtractor.extractLabels('skip/changelog,no/changelog')

    expect(labels).toStrictEqual(['skip/changelog', 'no/changelog'])
  })


  it('should handle multiple labels containing a `:` characters (emoji usage)', () => {
    const labels = labelExtractor.extractLabels(':wrench: GitHub Actions, :smile: Best Label Ever')

    expect(labels).toStrictEqual([':wrench: GitHub Actions', ':smile: Best Label Ever'])
  })
})
