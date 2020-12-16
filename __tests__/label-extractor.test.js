const versionExtractor = require('../src/label-extractor')

const EXPECTED_LABELS = ['label-1','label-2_with_underscore','special-[characters](please)']
const EXPECTED_LABELS_SPACES = ['label 1','label 2_with_underscore','special [characters] (please)']
const EXPECTED_SINGLE_ENTRY = ['no changelog entry needed']

describe('the verstion-extractor', () => {

  it('should return all labels', () => {
    const labels = versionExtractor.getLabels('label-1,label-2_with_underscore,special-[characters](please)')

    expect(labels).toStrictEqual(EXPECTED_LABELS)
  })
  
  it('should return all labels when spaces are included and trailing comma', () => {
    const labels = versionExtractor.getLabels('label-1 ,    label-2_with_underscore   ,      special-[characters](please),')

    expect(labels).toStrictEqual(EXPECTED_LABELS)
  })

  it('should return all labels with spaces', () => {
    const labels = versionExtractor.getLabels('label 1,label 2_with_underscore,special [characters] (please)')

    expect(labels).toStrictEqual(EXPECTED_LABELS_SPACES)
  })

  it('should return only a single labels with spaces', () => {
    const labels = versionExtractor.getLabels('no changelog entry needed')

    expect(labels).toStrictEqual(EXPECTED_SINGLE_ENTRY)
  })
})