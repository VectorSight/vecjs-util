type BytesToLocaleStringPreservedRule = (bytes: number) => boolean
export function bytesToLocaleString (
  bytes: number,
  preserved: number = 2,
  preservedRule: BytesToLocaleStringPreservedRule = bytes => bytes > 1024 ** 2
) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'ZB', 'YB']
  for (let i = 0; i < units.length; i += 1) {
    const num = bytes / (1024 ** i)
    if (num < 1024) {
      return `${num.toFixed(preservedRule(bytes) ? preserved : 0)} ${units[i]}`
    }
  }
  return '0 B'
}


export function random (len: number = 10) {
  const chars = []
  for (let i = 0; i < len; i += 1) {
    chars.push(Math.floor(Math.random() * 36).toString(36))
  }
  return chars.join('')
}

export function randomBase64Key (len = 32) {
  const arr = []
  for (let i = 0; i < len; i += 1) {
    arr.push(Math.floor(Math.random() * 256))
  }
  return Buffer.from(arr).toString('base64')
}

export function kebabToUpperCamelCase (str: string) {
  return str.replace(/(?:-(.))|(?:^(.))/g, (a, l1, l2) => (l1 || l2).toLocaleUpperCase())
}

export function kebabToLowerCamelCase (str: string) {
  return str.replace(/-(.)/g, (_, l) => l.toLocaleUpperCase())
}

export function camelToKebabCase (str: string) {
  return str.replace(/(?:^([A-Z]))|(?:([A-Z]))/g, (_, l1, l2) => (l2 ? '-' : '') + (l1 || l2).toLocaleLowerCase())
}

export function camelPrepend (dst: string, text: string) {
  return text + dst[0].toLocaleUpperCase() + dst.slice(1)
}
