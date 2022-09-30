const CONST = require('../const')
const GRIBSection = require('./section')

class GRIBSectionv1GDS extends GRIBSection {
  constructor() {
    super(1, CONST.section.v1.gds)

    this.dataType
    this.gridDescription
    /** @type {number} */
    this.nv
    /** @type {number} */
    this.pl
    /** @type {number} */
    this.pv
  }

  /**
   * @param {Buffer} buffer
   * @param {number} offset
   */
  parse(buffer, offset = 0) {
    console.log(buffer)
    this.length = 256 * 256 * buffer.readUInt8(0) + buffer.readUInt16BE(1)
    this.nv = buffer.readUInt8(3)
    this.dataType = buffer.readUInt8(5)

    {
      const pvplLocation = buffer.readUInt8(4)
      if (pvplLocation !== 255) {
        // @todo: get pl & pv
      }
    }

    switch (this.dataType) {
      case 0:
        this.gridDescription = {
          ni: buffer.readUInt16BE(6),
          nj: buffer.readUInt16BE(8),
          la1: this.bin2LatLon(buffer, 10),
          lo1: this.bin2LatLon(buffer, 13),
          resolution: buffer.readUInt8(16),
          la2: this.bin2LatLon(buffer, 17),
          lo2: this.bin2LatLon(buffer, 20),
          di: buffer.readUInt16BE(23),
          djN: buffer.readUInt16BE(25),
          flags: buffer.readUInt8(27),
        }
        break
      default:
        throw new Error(
          `GDS type ${this.dataType} not implemented @see https://www.nco.ncep.noaa.gov/pmb/docs/on388/table6.html`
        )
    }

    return this
  }
}

module.exports = GRIBSectionv1GDS
