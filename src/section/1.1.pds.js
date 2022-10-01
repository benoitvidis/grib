const CONST = require('../const')
const GRIBSection = require('./section')

/**
 * @typedef {import('node:events').EventEmitter} EventEmitter
 */

class GRIBSectionv1PDS extends GRIBSection {
  /**
   * @param {GRIBv1Dataset} dataset
   */
  constructor(dataset) {
    super(CONST.section.v1.pds, dataset, 8)

    this.average
    this.center
    this.century
    /** @type {Date} */
    this.date
    this.gridIdentification
    /** @type {boolean} */
    this.hasBMS
    /** @type {boolean} */
    this.hasGDS
    this.levelType
    this.measure
    this.missingAverage
    this.P1
    this.P2
    this.parameter
    this.processId
    this.scaleFactor
    this.subCenter
    this.timeUnit
    this.timeRange
  }

  parse() {
    const buffer = this.buffer

    this.length = 256 * 256 * buffer.readUInt8(0) + buffer.readUInt16BE(1)

    this.center = buffer.readUInt8(4)
    this.processId = buffer.readUInt8(5)
    this.gridIdentification = buffer.readUInt8(6)

    {
      const flag = buffer.readUInt8(7)
      this.hasBMS = Boolean(64 & flag)
      this.hasGDS = Boolean(128 & flag)
    }

    this.parameter = buffer.readUInt8(8)
    this.levelType = buffer.readUInt8(9)
    this.measure = buffer.readUInt16BE(10)

    {
      this.century = buffer.readUInt8(24)
      const year = (this.century - 1) * 100 + buffer.readUInt8(12)
      const month = buffer.readUInt8(13)
      const day = buffer.readUInt8(14)
      const hour = buffer.readUInt8(15)
      const minutes = buffer.readUInt8(16)

      this.date = new Date(year, month - 1, day, hour, minutes)
    }

    this.timeUnit = buffer.readUInt8(17)
    this.P1 = buffer.readUInt8(18)
    this.P2 = buffer.readUInt8(19)
    this.timeRange = buffer.readUInt8(20)
    this.average = buffer.readUInt16BE(21)
    this.missingAverage = buffer.readUInt8(23)
    this.subCenter = buffer.readUInt8(25)

    {
      let scale = buffer.readUInt16BE(26)
      if ((128 * 256) & scale) {
        scale = -1 * (scale ^ (128 * 256))
      }
      this.scaleFactor = scale
    }

    this.isDone = true
  }
}

module.exports = GRIBSectionv1PDS
