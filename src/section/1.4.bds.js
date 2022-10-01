const CONST = require('../const')
const GRIBSection = require('./section')

class GRIBSectionv1BDS extends GRIBSection {
  /**
   * @param {GRIBv1Dataset} dataset 
   * @param {number} offset 
   */
  constructor(dataset, offset) {
    super(CONST.section.v1.bms, dataset, offset)

    this.bitmap
    this.bitmapReference
  }

  parse() {
    // @todo
  }
}

module.exports = GRIBSectionv1BDS
