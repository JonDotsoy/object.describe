const toLower = require('lodash/toLower')
const isFunction = require('lodash/isFunction')
const isNull = require('lodash/isNull')
const isRegExp = require('lodash/isRegExp')
const isNaN = require('lodash/isNaN')
const chalk = require('chalk')
const toUpper = require('lodash/toUpper')
const padEnd = require('lodash/padEnd')
const max = require('lodash/max')
const isSymbol = require('lodash/isSymbol')
const {isObject} = require('./decompose')

const toTagCircular = (e) => e ? `[Circular ${e}]` : '[Circular]'
const DEFAULT_TAG_CIRCULAR = toTagCircular()

function jsonStringify (obj, decomposedObjArg) {
  const e = new Set()

  if (isRegExp(obj)) return obj.toString()

  if (isSymbol(obj)) return obj.toString()
  if (isNaN(obj)) return 'NaN'
  if (isFunction(obj)) return obj.toString()

  const rtrn = JSON.stringify(obj, (name, value) => {
    if (isRegExp(value)) return `[[[REGEXP[${value.toString()}]]]]`
    if (isSymbol(value)) return `[[[SYMBOL[${value.toString()}]]]]`

    if (isObject(value) && e.has(value)) {
      const [,, uid] = decomposedObjArg.find(([, content]) => content === value)
      const uidStyled = toUpper((uid).toString(16))

      return toTagCircular(uidStyled)
    } else {
      e.add(value)
      return value
    }
  })

  return rtrn
    // To RegExp
    .replace(/\"\[\[\[REGEXP\[(.+?)\]\]\]\]\"/g, ' $1 ')
    // To Symbols
    .replace(/\"\[\[\[SYMBOL\[(.+?)\]\]\]\]\"/g, ' $1 ')
    // To Circular
    .replace(/\"(\[Circular [0-9|A-F]+?\])\"/g, ' $1 ')
}

function getType (obj) {
  return isNull(obj)
    ? 'null'
    : isObject(obj)
      ? obj.constructor
        ? obj.constructor.name
        : typeof (obj)
      : typeof (obj)
}

function pathToString (path) {
  const rtrn = path
    // parse Symbols
    .map((el) => {
      if (isSymbol(el)) {
        return `[${el.toString()}]`
      } else {
        const _el = el.toString()
        if (/\./.test(_el)) {
          return `[${_el}]`
        } else {
          return `${_el}`
        }
      }
    })
    .join('.')

  return rtrn || '[]'
}

function loggerMD (decomposedObjArg, maxlengcontent = 40) {
  const prelines = []
  const lines = []

  decomposedObjArg.forEach(([path, content, uniqueId]) => {
    const uid = toUpper((uniqueId).toString(16))
    const preliteralString = String(jsonStringify(content, decomposedObjArg))

    const literalString = preliteralString.length >= maxlengcontent
      ? `${preliteralString.substring(0, maxlengcontent)}...`
      : preliteralString

    prelines.push([
      pathToString(path),
      uid,
      literalString,
      getType(content)
    ])
  })

  const strPath = 'Path'
  const strUniqueId = 'Unique ID'
  const strContent = 'Content'
  const strType = 'Type'

  const withPath = [0].concat([[strPath]], prelines).reduce((n, [path]) => {
    return max([n, path.length])
  })

  const withUniqueID = [0].concat([[, strUniqueId]], prelines).reduce((n, [, uniqueId]) => {
    return max([n, String(uniqueId).length])
  })

  const withContent = [0].concat([[,, strContent]], prelines).reduce((n, [,, content]) => {
    return max([n, String(content).length])
  })

  const withType = [0].concat([[,,, strType]], prelines).reduce((n, [,,, type]) => {
    return max([n, String(type).length])
  })

  lines.push(`| ${padEnd(strPath, withPath)} | ${padEnd(strUniqueId, withUniqueID)} | ${padEnd(strType, withType)} | ${padEnd(strContent, withContent)} |`)
  lines.push(`| ${padEnd('', withPath, '-')} | ${padEnd('', withUniqueID, '-')} | ${padEnd('', withType, '-')} | ${padEnd('', withContent, '-')} |`)

  prelines.forEach(([path, uniqueId, content, type]) => {
    const contentSyled = content

    lines.push(`| ${padEnd(path, withPath)} | ${padEnd(uniqueId, withUniqueID)} | ${padEnd(type, withType)} | ${padEnd(contentSyled, withContent)} |`)
  })

  return lines.join('\n')
}

function logger (decomposedObjArg, format = 'md') {
  switch (toLower(format)) {
    case 'md': return loggerMD(decomposedObjArg)
    default: throw new TypeError('Format is not valid.')
  }
}

exports = module.exports = {
  __esModule: true,
  default: logger,
  loggerMD,
  logger
}

