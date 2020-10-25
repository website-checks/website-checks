'use strict';

const path = require('path')
const retry = require('../retry')
const checkFunction = require('../check-function')

module.exports = async () => {
  if (no_cli_flags || options_keys.includes('--hstspreload')) {
    const name = 'HSTS Preload List'
    async function tryBlock(page) {
      await page._client.send('Emulation.clearDeviceMetricsOverride')
      await retry(() => page.goto('https://hstspreload.org/?domain=' + url), 1000)
      await page.waitForSelector('#result', { timeout: 30000, visible: true })
      await page.pdf({ path: path.resolve(output_path, './hstspreload.pdf'), format: 'A4', printBackground: true })
    }
    await checkFunction(name, tryBlock)
  }
}

module.exports.help = `
  --hstspreloadcheck
  Runs the HSTS Preload Check check
`