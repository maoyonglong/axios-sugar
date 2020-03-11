/**
 * The MIT License (MIT)
 * 
 * Copyright © 2014, Andrei Karpushonak aka @miktam
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * *******************************
 * The MIT License applies to vendor/object-sizeof folder only.
 * *******************************
 */

'use strict'

import ECMA_SIZES from './byte_size'
var isBrowser = window !== undefined
if (!isBrowser) {
  /* eslint-disable global-require */
  var Buffer = require('buffer').Buffer
}

function sizeOfObject (seen, object) {
  if (object == null) {
    return 0
  }

  var bytes = 0
  for (var key in object) {
    // Do not recalculate circular references
    if (typeof object[key] === 'object' && object[key] !== null) {
      if (seen.has(object[key])) {
        continue
      }
      seen.add(object[key])
    }

    bytes += getCalculator(seen)(key)
    try {
      bytes += getCalculator(seen)(object[key])
    } catch (ex) {
      if (ex instanceof RangeError) {
        // circular reference detected, final result might be incorrect
        // let's be nice and not throw an exception
        bytes = 0
      }
    }
  }

  return bytes
}

function getCalculator (seen) {
  return function (object) {
    if (!isBrowser && Buffer.isBuffer(object)) {
      return object.length
    }

    var objectType = typeof (object)
    switch (objectType) {
      case 'string':
        return object.length * ECMA_SIZES.STRING
      case 'boolean':
        return ECMA_SIZES.BOOLEAN
      case 'number':
        return ECMA_SIZES.NUMBER
      case 'object':
        if (Array.isArray(object)) {
          return object.map(getCalculator(seen)).reduce(function (acc, curr) {
            return acc + curr
          }, 0)
        } else {
          return sizeOfObject(seen, object)
        }
      default:
        return 0
    }
  }
}

/**
 * Main module's entry point
 * Calculates Bytes for the provided parameter
 * @param object - handles object/string/boolean/buffer
 * @returns {*}
 */
function sizeof (object) {
  return getCalculator(new WeakSet())(object)
}

export default sizeof
