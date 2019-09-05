const { red } = require('kleur')

module.exports = async (err, page, name, open_pages, teardown, browser) => {
  await page.close()
  open_pages--
  await teardown(open_pages, browser)
  console.log(red('[error] ' + name), red(err))
}
