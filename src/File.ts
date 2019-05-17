import Path from 'path'
import { Stats } from 'fs'

export function isGrandChildren (elder: string, younger: string) {
  const elderFragments = elder.split('/')
  const youngerFragments = younger.split('/')
  for (const [index, el] of elderFragments.entries()) {
    if (el !== youngerFragments[index]) {
      return false
    }
  }
  return true
}

export function isMovable (paths: string[], dst: string) {
  return !paths.some(r => isGrandChildren(r, dst) || Path.dirname(r) === dst)
}

export function modeIntToString (mode: number) {
  const result = Buffer.from('drwxrwxrwx')

  if (!(mode & 0o40000))
    result[0] = 45

  for (let i = 1, bit = 0o400; bit; i++, bit >>= 1) {
    if (!(mode & bit)) result[i] = 45
  }

  return result.toString()
}

export function permissionNumberToString (num: number) {
  return [...num.toString()]
  .map(d => [
    +d & 0o4 ? 'r' : '-',
    +d & 0o2 ? 'w' : '-',
    +d & 0o1 ? 'x' : '-',
  ].join('')).join('')
}

export function permissionStringToNumber (str: string) {
  return parseInt(str.match(/.{1,3}/g)
  .map(s => [
    s[0] === 'r' ? 4 : 0,
    s[1] === 'w' ? 2 : 0,
    s[2] === 'x' ? 1 : 0
  ].reduce((a, b) => a + b, 0))
  .join(''))
}

export class SmartFileStats extends Stats {
  isDirectory () {
    if (this.isSymbolicLink()) {
      return this.size === 1
    } else {
      return super.isDirectory()
    }
  }
}
