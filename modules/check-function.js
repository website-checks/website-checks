const { green } = require('kleur')
const successHandler = require('./success-handler')
const errorHandler = require('./error-handler')
const teardown = require('./teardown')

module.exports = async (name, tryBlock, browser, open_pages) => {
  console.log(green('[started] ' + name))
  const page = await browser.newPage()
  open_pages++
  try {
    await tryBlock(page)
    await successHandler(page, name, open_pages, browser)
  } catch (err) {
    await errorHandler(err, page, name, open_pages, teardown, browser)
  }
}