const CONST = require('../const')
const GRIBDataset = require('./dataset')

const { GRIBSectionv1BMS, GRIBSectionv1GDS, GRIBSectionv1PDS } = require('../section')

/**
 * @typedef {import('node:events').EventEmitter} EventEmitter
 */

class GRIBv1Dataset extends GRIBDataset {
  /**
   * @param {GRIB} grib
   */
  constructor(grib) {
    super(1, grib)

    this.bds
    this.bms
    this.gds
    this.pds = new GRIBSectionv1PDS(this)

    this.section = this.pds
  }

  nextSection() {
    if (!this.section.isDone) return this.section

    const offset = this.section.offset + this.section.length

    switch (this.section.type) {
      case CONST.section.v1.pds:
        if (this.section.hasGDS) {
          if (!this.gds) this.gds = new GRIBSectionv1GDS(this, offset)
          return this.gds
        } else if (this.section.hasBMS) {
          if (!this.bms) this.bms = new GRIBSectionv1BMS(this, offset)
          return this.bms
        } else {
          return this.bds
        }
      case CONST.section.v1.gds:
        if (this.pds.hasBMS) {
          if (!this.bms) this.bms = new GRIBSectionv1BMS(this, offset)
          return this.bms
        } else {
          return this.bds
        }
    }
  }
}

module.exports = GRIBv1Dataset
