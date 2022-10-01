const CONST = require('../const')
const GRIBSection = require('./section')

/**
 * @typedef {import('node:events').EventEmitter} EventEmitter
 */

class GRIBSectionv1GDS extends GRIBSection {
  /**
   * @param {GRIBv1Dataset} dataset
   * @param {number} offset
   */
  constructor(dataset, offset) {
    super(CONST.section.v1.gds, dataset, offset)

    this.dataType
    this.gridDescription
    /** @type {number} */
    this.nv
    /** @type {number} */
    this.pl
    /** @type {number} */
    this.pv
  }

  parse() {
    const buffer = this.buffer

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
          di: buffer.readUInt16BE(23),
          djN: buffer.readUInt16BE(25),
          flags: buffer.readUInt8(27),
          la1: this.bin2LatLon(buffer, 10),
          la2: this.bin2LatLon(buffer, 17),
          lo1: this.bin2LatLon(buffer, 13),
          lo2: this.bin2LatLon(buffer, 20),
          ni: buffer.readUInt16BE(6),
          nj: buffer.readUInt16BE(8),
          resolution: buffer.readUInt8(16),
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
