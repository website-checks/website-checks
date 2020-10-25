'use strict';

const { green } = require('kleur')
const teardown = require('./teardown')

module.exports = async (params) => {
  let [ page, name ] = params
  console.log(green('[done] ' + name))
  await page.close()
  open_pages--
  await teardown()
}
