'use strict';

const { green } = require('kleur')
const successHandler = require('./success-handler')
const errorHandler = require('./error-handler')

module.exports = async (name, tryBlock) => {
  console.log(green('[started] ' + name))
  const page = await browser.newPage()
  open_pages++
  const params = [ page, name ]
  try {
    await tryBlock(page)
    await successHandler(params)
  } catch (err) {
    params.unshift(err)
    await errorHandler(params)
  }
}