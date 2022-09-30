const { EventEmitter } = require('node:stream')

const CONST = require('./const')

const { GRIBSectionv1PDS, GRIBSectionv1GDS, GRIBSectionv1BMS } = require('./section')

class GRIBParser extends EventEmitter {
  /**
   * @param {ReadableStream} stream
   */
  constructor(stream) {
    super()

    this.actions = []

    this.buffer = Buffer.from('')
    this.bufferMaxSize = 1024 * 1024 * 1024 * 4 // 4MB
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
    this.buffer = Buffer.concat([this.buffer, chunk])

    if (this.version === undefined && this.buffer.byteLength >= 16) {
      this.version = this.buffer.readUInt8(7)

      console.log(this.version, this.version === 1)

      if (this.version === 1) {
        this.length = 256 * 256 * this.buffer.readUInt8(4) + this.buffer.readUInt16BE(5)
        this.position = 8

        const r = new GRIBSectionv1PDS()
        console.log(r.parse(this.buffer.subarray(this.position)))
        this.position += r.length

        if (r.hasGDS) {
          const s = new GRIBSectionv1GDS()
          console.log(s.parse(this.buffer.subarray(this.position)))
          this.position += s.length
        }
        if (r.hasBMS) {
          const s = new GRIBSectionv1BMS()
          console.log(s.parse(this.buffer.subarray(this.position)))
          this.position += s.length
        }
      } else if (this.version === 2) {
        this.discipline = this.buffer.readUInt8(6)
        this.length = this.buffer.readBigUInt64BE(8)
        this.position = 16
      }
    }

    if (this.buffer.byteLength > this.bufferMaxSize) {
      this.offet += this.buffer.byteLength - this.bufferMaxSize
      this.buffer = this.buffer.subarray(-1 * this.bufferMaxSize)
    }

    this.stream.push(null)
  }

  parse() {
    this.stream.read()
  }
}

module.exports = {}
;(async () => {
  const { createReadStream } = require('node:fs')

  const s = createReadStream(
    './adaptor.mars.internal-1664107079.7990139-7424-16-9e418cc3-ff85-4ee2-81ed-166b1e298b2a.grib'
  )

  const parser = new GRIBParser(s)
  parser.parse()
})()
