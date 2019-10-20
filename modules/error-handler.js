const { red } = require('kleur')
const teardown = require('./teardown')

module.exports = async (params) => {
  let [ err, page, name ] = params
  console.log(red('[error] ' + name), red(err))
  errors++
  await page.close()
  open_pages--
  await teardown()
}
