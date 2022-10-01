/**
 * @typedef {import('node:events').EventEmitter} EventEmitter
 */

class GRIBSection {
  /**
   * @param {string} type
   * @param {GRIBDataset} dataset
   * @param {number} offset
   */
  constructor(type, dataset, offset) {
    this.dataset = dataset

    this.isDone = false

    /** @type {number} */
    this.length
    this.offset = offset

    this.position = 0
    this.type = type
  }

  /**
   * @returns {Buffer}
   */
  get buffer() {
    return this.dataset.grib.buffer.subarray(this.offset - this.dataset.grib.buffer.offset)
  }

  /**
   * @param {Buffer} buffer
   * @param {0} offset
   * @returns {number}
   */
  bin2LatLon(buffer, offset) {
    let mul = 1

    let firstByte = buffer.readUInt8(offset)
    if (firstByte & 128) {
      firstByte = firstByte ^ 128
      mul = -1
    }

    return (mul / 1000) * (256 * 256 * firstByte + buffer.readUInt16BE(offset + 1))
  }

  /**
   * @param {Buffer} buffer
   * @param {number} offset
   * @returns {number}
   */
  bin3bytes2Int(buffer, offset) {
    return 256 * 256 * buffer.readUInt8(offset) + buffer.readUInt16BE(offset + 1)
  }

  parse() {
    throw new Error('not implemented')
  }
}

module.exports = GRIBSection
