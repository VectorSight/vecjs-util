import { Writable, Readable } from 'stream'

export class BufferWritable extends Writable {
  reallocIncrement: number
  u8arr: Uint8Array
  ptr: number

  constructor () {
    super()

    this.reallocIncrement = 1024 ** 2
    this.u8arr = new Uint8Array(this.reallocIncrement)
    this.ptr = 0
  }

  _write (chunk: any, encoding: string, callback: (error?: Error | null) => void) {
    const newLength = this.ptr + chunk.length
    if (newLength > this.u8arr.length) {
      const targetCapacity = Math.ceil(newLength / this.reallocIncrement) * this.reallocIncrement
      const newU8arr = new Uint8Array(targetCapacity)
      newU8arr.set(this.u8arr)
      this.u8arr = newU8arr
    }
    this.u8arr.set(chunk, this.ptr)
    this.ptr += chunk.length
    callback && callback()
  }

  _final(callback: (error?: Error | null) => void) {
    callback()
  }

  toBuffer () {
    return Buffer.from(this.u8arr.buffer, 0, this.ptr)
  }
}

export class BufferReadable extends Readable {
  ptr: number

  constructor (public buffer: Buffer) {
    super()
    this.buffer = buffer
    this.ptr = 0
  }

  _read(size: number) {
    if (size > 0) {
      if (this.ptr + size <= this.buffer.length) {
        this.push(this.buffer.slice(this.ptr, this.ptr + size))
        this.ptr += size
      } else {
        this.push(this.buffer.slice(this.ptr))
        this.push(null)
      }
    }
  }
}
