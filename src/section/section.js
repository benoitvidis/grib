class GRIBSection {
  /**
   * @param {number} gribVersion
   * @param {string} type
   */
  constructor(gribVersion, type) {
    this.gribVersion = gribVersion

    /** @type {number} */
    this.length

    this.position = 0
    this.type = type
  }

  /**
   * @param {Buffer} buffer
   * @param {number} offset
   */
  parse(buffer, offset = 0) {
    throw new Error('not implemented')
  }

  /**
   * @param {Buffer} buffer
   * @param {0} offset
   */
  bin2LatLon(buffer, offset) {
    let mul = 1

    let firstByte = buffer.readUInt8(offset)
    if (firstByte & 128) {
      firstByte = firstByte ^ 128
      mul = -1
    }
    console.log({
      firstByte,
      mul,
    })

    return (mul / 1000) * (256 * 256 * firstByte + buffer.readUInt16BE(offset + 1))
  }

  /**
   * @param {Buffer} buffer
   * @param {number} offset
   * @returns
   */
  bin3bytes2Int(buffer, offset) {
    return 256 * 256 * buffer.readUInt8(offset) + buffer.readUInt16BE(offset + 1)
  }
}

module.exports = GRIBSection
