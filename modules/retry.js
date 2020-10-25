'use strict';

const util = require('util')
const delay = util.promisify(setTimeout)

module.exports = async (fn, retryDelay = 100, numRetries = 3) => {
  for (let i = 0; i < numRetries; i++) {
    try {
      return await fn()
    } catch (e) {
      if (i === numRetries - 1) throw e
      await delay(retryDelay)
      retryDelay = retryDelay * 2
    }
  }
}
