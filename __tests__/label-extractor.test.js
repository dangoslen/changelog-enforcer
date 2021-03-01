const labelExtractor = require('../src/label-extractor')

const EXPECTED_LABELS = ['label-1','label-2_with_underscore','special-[characters](please)']
const EXPECTED_LABELS_SPACES = ['label 1','label 2_with_underscore','special [characters] (please)']
const EXPECTED_SINGLE_ENTRY = ['no changelog entry needed']

describe('the verstion-extractor', () => {

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
})