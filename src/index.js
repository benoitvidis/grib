const { EventEmitter } = require('node:stream')

class GRIB2Parser extends EventEmitter {
  /**
   * @param {ReadableStream} stream
   */
  constructor(stream) {
    super()

    this.actions = []

    this.buffer = Buffer.from('')
    this.bufferMaxSize = 1024 * 1024 * 1024 * 4 // 4MB
    this.position = 0
    this.stream = stream

    this.stream.on('data', (buf) => this.onData(buf))
    this.stream.on('error', (e) => {
      throw e
    })
    this.stream.on('end', () => {
      console.log(this)
    })
  }

  /**
   * @param {Buffer} chunk
   */
  onData(chunk) {
    this.buffer = Buffer.concat([this.buffer, chunk])
    this.position += chunk.byteLength

    if (this.position > 400) {
      this.stream.push(null)
    }

    if (this.buffer.byteLength > this.bufferMaxSize) this.buffer = this.buffer.subarray(-1 * this.bufferMaxSize)
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

  const parser = new GRIB2Parser(s)
  parser.parse()
})()
