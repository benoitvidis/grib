class GRIBDataset {
  /**
   * @param {(1|2)} version
   * @param {GRIB} grib
   */
  constructor(version, grib) {
    this.grib = grib

    /** @type {GRIBSection} */
    this.section
    /** @type {GRIBSection[]} */
    this.sections

    this.version = version
  }

  nextSection() {
    throw new Error('not implemented')
  }
}

module.exports = GRIBDataset
