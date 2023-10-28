'use strict';

const path = require('path')
const checkFunction = require('../check-function')

module.exports = async () => {
  if (no_cli_flags || options_keys.includes('--pingdom')) {
    const name = 'Pingdom'
    async function tryBlock(page) {
      await page._client.send('Emulation.clearDeviceMetricsOverride')
      await page.goto('https://tools.pingdom.com/')
      await page.waitForSelector('#urlInput')
      await page.type("#urlInput", url)
      await page.click('.ng-tns-c3-0 > .view > .grid > .grid__col-sm-2 > .button')
      await page.waitForSelector('.download-har')
      await page.emulateMediaType('screen')
      await page.pdf({ path: path.resolve(output_path, './pingdom.pdf'), format: 'A4', printBackground: true })
    }
    await checkFunction(name, tryBlock)
  }
}

module.exports.help = `
  --pingdom
  Runs the Pingdom check
`