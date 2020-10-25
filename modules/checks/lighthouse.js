'use strict';

const path = require('path')
const retry = require('../retry')
const checkFunction = require('../check-function')

module.exports = async () => {
  if (no_cli_flags || options_keys.includes('--lighthouse')) {
    const name = 'Lighthouse'
    async function tryBlock(page) {
      await page._client.send('Emulation.clearDeviceMetricsOverride')
      await retry(() => page.goto('https://lighthouse-ci.appspot.com/try'), 1000)
      await page.type('#url', url)
      await page.click('.url-section .search-arrow')
      await page.waitForSelector('body.done', { timeout: 60000 })
      const link = await page.evaluate(() => document.querySelector('#reportLink').href)
      await page.goto(link)
      await page.pdf({ path: path.resolve(output_path, './lighthouse.pdf'), format: 'A4', printBackground: true })
    }
    await checkFunction(name, tryBlock)
  }
}

module.exports.help = `
  --lighthouse
  Runs the Lighthouse check
`