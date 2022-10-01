const { EventEmitter } = require('node:stream')

const { GRIBv1Dataset } = require('./dataset')

class GRIB extends EventEmitter {
  /**
   * @param {ReadableStream} stream
   */
  constructor(stream) {
    super()

    this.actions = []

    this.buffer = Buffer.from('')
    this.bufferMaxSize = 1024 * 1024 * 1024 * 4 // 4MB

    /** @type {GRIBDataset} */
    this.dataset

    this.offset = 0
    this.position = 0
    this.section
    this.stream = stream

    this.stream.on('data', (buf) => this.onData(buf))
    this.stream.on('error', (e) => {
      throw e
    })
    this.stream.on('end', () => {})

    this.discipline
    this.length
    this.version
  }

  /**
   * @param {Buffer} chunk
   */
  onData(chunk) {
    if (this.buffer.byteLength + chunk.byteLength > this.bufferMaxSize) {
      const shiftBytes = this.buffer.byteLength + chunk.byteLength - this.bufferMaxSize

      this.buffer = Buffer.from(Buffer.concat([this.buffer.subarray(shiftBytes), chunk]))
      this.offset += shiftBytes
      this.position -= shiftBytes
    } else {
      this.buffer = Buffer.concat([this.buffer, chunk])
    }

    if (this.dataset === undefined) {
      this.version = this.buffer.readUInt8(7)

      if (this.version === 1) {
        this.dataset = new GRIBv1Dataset(this)
        this.position = 8
      }
    }

    this.dataset.section.parse()
    if (this.dataset.section.isDone) {
      this.position += this.dataset.section.length
      this.dataset.section = this.dataset.nextSection()
      this.dataset.section.parse()
    }

    this.stream.push(null)
  }

  parse() {
    this.stream.read()
  }
}

module.exports = { GRIB }
;(async () => {
  const { createReadStream } = require('node:fs')

  const s = createReadStream(
    './adaptor.mars.internal-1664107079.7990139-7424-16-9e418cc3-ff85-4ee2-81ed-166b1e298b2a.grib'
  )

  const parser = new GRIB(s)
  parser.parse()
})()
