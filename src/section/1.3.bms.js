const CONST = require('../const')
const GRIBSection = require('./section')

class GRIBSectionv1BMS extends GRIBSection {
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
    this.length = this.bin3bytes2Int(this.buffer, 0)

    this.bitmapReference = this.buffer.readUInt16BE(4)
    if (this.bitmapReference === 0) {
      this.bitmap = this.buffer.subarray(6, this.length - this.buffer.readUInt8(3))
    }

    return this
  }
}

module.exports = GRIBSectionv1BMS
