type ArrayFindCondition<T> = (element: T, index: number, array: T[]) => boolean

interface Array<T> {
  indexOfSubseq (subseq: T[]): number
  includesSubseq (subseq: T[]): boolean
  countSubseq (subseq: T[]): number
  remove (...elements: T[]): void
  removeWhere (condition: ArrayFindCondition<T>): boolean
  removeAllWhere (condition: ArrayFindCondition<T>): void
  insert (index: number, ...elements: T[]): void
  insertBefore (before: T, ...elements: T[]): void
  insertAfter (after: T, ...elements: T[]): void
  insertBeforeWhere (beforeCondition: ArrayFindCondition<T>, ...elements: T[]): void
  insertAfterWhere (beforeCondition: ArrayFindCondition<T>, ...elements: T[]): void
  removeAt (index: number): void
  clear (): void
  reset (...elements: T[]): void
  replace (match: T, ...targets: T[]): void
  replaceWhere (matchCondition: ArrayFindCondition<T>, ...targets: T[]): void
  pushSet (...elements: T[]): void
  swap (i1: T, i2: T): void
  moveRight (i: number): void
  moveLeft (i: number): void
  moveNext (i: number): void
  movePrev (i: number): void
  moveOffset (item: T, offset: number): void
  isEmpty (): boolean
  last (): T
  equal (target: any[]): boolean
  reversed (): T[]
  findLast (condition: ArrayFindCondition<T>): T
  repeat (count: number): T[]
  findOr (condition: ArrayFindCondition<T>, defaultResult: T): T
}

interface Uint8Array {
  indexOfSubseq (subseq: any[]): number
  includesSubseq (subseq: any[]): boolean
  countSubseq (subseq: any[]): number
}

const partialMatchTable = new WeakMap()

function generatePartialMatchTable (array: any[]) {
  const partialMatched: number[] = [0]
  for (let l = 2; l <= array.length; l += 1) {
    let len = 0
    for (let sl = 1; sl < l; sl += 1) {
      let diff = false
      for (let i = 0; i < sl; i += 1) {
        if (array[i] !== array[l - sl + i]) {
          diff = true
        }
      }
      if (!diff) {
        len = sl
      }
    }
    partialMatched.push(len)
  }
  return partialMatched
}

function indexOfSubseq<T> (subseq: T[]): number {
  let pmt = partialMatchTable.get(subseq)
  if (!pmt) {
    pmt = generatePartialMatchTable(subseq)
    partialMatchTable.set(subseq, pmt)
  }

  let mainInd = 0
  let subInd = 0
  let matched = 0

  while (mainInd < this.length) {
    if (this[mainInd] !== subseq[subInd]) {
      if (matched > 0) {
        const step = matched - pmt[subInd]
        mainInd += step
        subInd -= step
      } else {
        mainInd += 1
        subInd = 0
      }
      matched = 0
    } else {
      mainInd += 1
      subInd += 1
      matched += 1
    }

    if (matched === subseq.length) {
      return mainInd - matched
    }
  }

  return -1
}

Array.prototype.indexOfSubseq = indexOfSubseq
Uint8Array.prototype.indexOfSubseq = indexOfSubseq

function includesSubseq<T> (subseq: T[]) {
  return this.indexOfSubseq(subseq) > -1
}
Array.prototype.includesSubseq = includesSubseq
Uint8Array.prototype.includesSubseq = includesSubseq

function countSubseq<T> (subseq: T[]) {
  let pmt = partialMatchTable.get(subseq)
  if (!pmt) {
    pmt = generatePartialMatchTable(subseq)
    partialMatchTable.set(subseq, pmt)
  }

  let mainInd = 0
  let subInd = 0
  let matched = 0

  let counter = 0

  while (mainInd < this.length) {
    if (this[mainInd] !== subseq[subInd]) {
      if (matched > 0) {
        const step = matched - pmt[subInd]
        mainInd += step
        subInd -= step
      } else {
        mainInd += 1
        subInd = 0
      }
      matched = 0
    } else {
      mainInd += 1
      subInd += 1
      matched += 1
    }

    if (matched === subseq.length) {
      counter += 1
      // TODO: http://www.ruanyifeng.com/blog/2013/05/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm.html
    }
  }

  return counter
}
Array.prototype.countSubseq = countSubseq
Uint8Array.prototype.countSubseq = countSubseq

Array.prototype.remove = function<T> (...elements: T[]) {
  for (const element of elements) {
    const index = this.indexOf(element)
    if (index > -1) {
      this.splice(index, 1)
    }
  }
}

Array.prototype.removeWhere = function<T> (condition: ArrayFindCondition<T>) {
  const index = this.findIndex(condition)
  if (index > -1) {
    this.splice(index, 1)
    return true
  } else {
    return false
  }
}

Array.prototype.removeAllWhere = function<T> (condition: ArrayFindCondition<T>) {
  const arr = [...this]
  this.clear()
  for (let [index, item] of arr.entries()) {
    if (!condition(item, index, this)) {
      this.push(item)
    }
  }
}


Array.prototype.insert = function<T> (index: number, ...elements: T[]) {
  this.splice(index, 0, ...elements)
}

Array.prototype.insertBefore = function<T> (before: T, ...elements: T[]) {
  const beforeIndex = this.indexOf(before)
  if (beforeIndex > -1) {
    this.splice(beforeIndex, 0, ...elements)
  }
}

Array.prototype.insertAfter = function<T> (after: T, ...elements: T[]) {
  const afterIndex = this.indexOf(after)
  if (afterIndex > -1) {
    this.splice(afterIndex + 1, 0, ...elements)
  }
}

Array.prototype.insertBeforeWhere = function<T> (beforeCondition: ArrayFindCondition<T>, ...elements: T[]) {
  const beforeIndex = this.findIndex(beforeCondition)
  if (beforeIndex > -1) {
    this.splice(beforeIndex, 0, ...elements)
  }
}

Array.prototype.insertAfterWhere = function<T> (afterCondition: ArrayFindCondition<T>, ...elements: T[]) {
  const afterIndex = this.findIndex(afterCondition)
  if (afterIndex > -1) {
    this.splice(afterIndex + 1, 0, ...elements)
  }
}

Array.prototype.removeAt = function (index: number) {
  this.splice(index, 1)
}

Array.prototype.clear = function () {
  this.splice(0, this.length)
}

Array.prototype.reset = function<T> (...elements: T[]) {
  this.clear()
  this.push(...elements)
}

Array.prototype.replace = function<T> (match: T, ...targets: T[]) {
  const matchIndex = this.indexOf(match)
  if (matchIndex > -1) {
    this.splice(matchIndex, 1, ...targets)
  }
}

Array.prototype.replaceWhere = function<T> (matchCondition: ArrayFindCondition<T>, ...targets: T[]) {
  const matchIndex = this.findIndex(matchCondition)
  if (matchIndex > -1) {
    this.splice(matchIndex, 1, ...targets)
  }
}

Array.prototype.pushSet = function<T> (...elements: T[]) {
  for (const element of elements) {
    if (!this.includes(element)) {
      this.push(element)
    }
  }
}

Array.prototype.swap = function<T> (i1: T, i2: T) {
  const temp = this[i1]
  this[i1] = this[i2]
  this[i2] = temp
}

Array.prototype.moveRight = function (i: number) {
  if (i < this.length - 1) {
    const el = this[i]
    this.removeAt(i)
    this.push(el)
  }
}

Array.prototype.moveLeft = function (i: number) {
  if (i > 0) {
    const el = this[i]
    this.removeAt(i)
    this.unshift(el)
  }
}

Array.prototype.moveNext = function (i: number) {
  if (i < this.length - 1) {
    this.swap(i, i + 1)
  }
}

Array.prototype.movePrev = function (i: number) {
  if (i > 0) {
    this.swap(i, i - 1)
  }
}

Array.prototype.moveOffset = function<T> (item: T, offset: number) {
  const index = this.indexOf(item)
  this.swap(index, index + offset)
}

Array.prototype.isEmpty = function () {
  return this.length === 0
}

Array.prototype.last = function () {
  return this[this.length - 1]
}

Array.prototype.equal = function (target: any[]) {
  return this.every((el: any, index: number) => target[index] === el)
}

Array.prototype.reversed = function () {
  return [...this].reverse()
}

Array.prototype.findLast = function<T> (condition: ArrayFindCondition<T>) {
  for (let i = this.length - 1; i >= 0; i -= 1) {
    if (condition(this[i], i, this)) {
      return this[i]
    }
  }
  return null
}

Array.prototype.repeat = function (count: number) {
  const arr = []
  for (let i = 0; i < count; i += 1) {
    arr.push(...this)
  }
  return arr
}

Array.prototype.findOr = function<T> (condition: ArrayFindCondition<T>, defaultResult: T) {
  return this.find(condition) || defaultResult
}
