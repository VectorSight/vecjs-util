interface Function {
  _this: any
}

const oldBind = Function.prototype.bind
Function.prototype.bind = function(thisArg, ...args) {
  const newFn = oldBind.call(this, thisArg, ...args)
  newFn._this = thisArg
  return newFn
}
