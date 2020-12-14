const versionExtractor = require('../src/label-extractor')

const EXPECTED_LABELS = ['label-1','label-2_with_underscore','special-[characters](please)']

describe('the verstion-extractor', () => {

  it('should return all labels', () => {
    const labels = versionExtractor.getLabels('label-1,label-2_with_underscore,special-[characters](please)')

    expect(labels).toStrictEqual(EXPECTED_LABELS)
  }),
  it('should return all labels when spaces are included and trailing comma', () => {
    const labels = versionExtractor.getLabels('label-1 ,    label-2_with_underscore   ,      special-[characters](please),')

    expect(labels).toStrictEqual(EXPECTED_LABELS)
  })
})