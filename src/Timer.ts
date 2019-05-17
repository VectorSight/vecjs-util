import { VString } from './index'

export async function delay (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export interface IDebounceOptions {
  arguments?: boolean
  key?: string
}
const debounceTimerMap = new WeakMap<any, Map<any, NodeJS.Timeout>>()
export function debounced (ms: number, options: IDebounceOptions = {}) {
  return function (target: any, key: any, descriptor: PropertyDescriptor) {
    options.key = key
    descriptor.value = debounce(descriptor.value, ms, options)
  }
}

const placeholderObj = {}
export function debounce<T extends Function> (fn: T, ms: number, options: IDebounceOptions = {}) {
  const key = options.key || VString.random(10)
  return function () {
    const obj = typeof this === 'object' ? this : placeholderObj

    if (!debounceTimerMap.has(obj)) {
      debounceTimerMap.set(obj, new Map())
    }

    const methodMap = debounceTimerMap.get(obj)

    let id = key
    if (options.arguments) {
      id = key + JSON.stringify(arguments)
    }

    const timer = methodMap.get(id)
    if (timer) {
      clearInterval(timer)
    }
    methodMap.set(id, setTimeout(() => {
      fn.apply(this, arguments)
    }, ms))
  }
}
