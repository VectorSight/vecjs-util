type TraverseHandler = (value: any, key: any, object: any, keyPath: any[]) => void
export function traverse (obj: any, handler: TraverseHandler, keyPath: any[] = []) {
  for (let [key, value] of Object.entries(obj)) {
    handler(value, key, obj, [...keyPath, key])
    if (Array.isArray(value) || (value !== null && (value as any)['__proto__'] === Object.prototype)) {
      traverse(value, handler, [...keyPath, key])
    }
  }
}

export function clone<T> (obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(item => clone(item)) as any as T
  } else if (typeof obj === 'object' && obj !== null) {
    const fresh: any = {}
    for (let [key, value] of Object.entries(obj)) {
      fresh[key] = clone(value)
    }
    return fresh
  } else {
    return obj
  }
}

export function equal (a: any, b: any): boolean {
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) return false
    return a.every((item, index) => equal(item, b[index])) && a.length === b.length
  } else if (a === null) {
    return b === null
  } else if (typeof a === 'object') {
    if (typeof b !== 'object') return false
    const keys = Object.keys(a)
    if (!equal(keys, Object.keys(b))) return false
    for (let key of keys) {
      if (a[key] === null) {
        if (b[key] !== null) return false
      } else {
        if (!equal(a[key], b[key])) return false
      }
    }
  } else {
    if (a !== b) return false
  }
  return true
}

