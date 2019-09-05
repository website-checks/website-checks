const { green } = require('kleur')
const teardown = require('./teardown')

module.exports = async (page, name, open_pages, browser) => {
  await page.close()
  open_pages--
  await teardown(open_pages, browser)
  console.log(green('[done] ' + name))
}
