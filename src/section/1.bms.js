const CONST = require('../const')
const GRIBSection = require('./section')

class GRIBSectionv1BMS extends GRIBSection {
  constructor() {
    super(1, CONST.section.v1.bms)

    this.bitmap
    this.bitmapReference
  }

  /**
   * @param {Buffer} buffer
   * @param {number} offset
   */
  parse(buffer, offset = 0) {
    this.length = this.bin3bytes2Int(buffer, 0)

    this.bitmapReference = buffer.readUInt16BE(4)
    if (this.bitmapReference === 0) {
      this.bitmap = buffer.subarray(6, this.length - buffer.readUInt8(3))
    }

    return this
  }
}

module.exports = GRIBSectionv1BMS
