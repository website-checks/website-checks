'use strict';

const path = require('path')
const checkFunction = require('../check-function')

module.exports = async () => {
  if (no_cli_flags || options_keys.includes('--webbkoll')) {
    const name = 'webbkoll'
    async function tryBlock(page) {
      await page._client.send('Emulation.clearDeviceMetricsOverride')
      await page.goto('https://webbkoll.dataskydd.net/en/check?url=' + url + '&refresh=on')
      await page.click("form.search-bar button");
      await page.waitForFunction('window.location.href.startsWith("https://webbkoll.dataskydd.net/en/results")', { timeout: 240000 })
      await page.pdf({ path: path.resolve(output_path, './webbkoll.pdf'), format: 'A4', printBackground: true })
    }
    await checkFunction(name, tryBlock)
  }
}

module.exports.help = `
  --webbkoll
  Runs the webbkoll check
`