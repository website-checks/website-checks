'use strict';

const path = require('path')
const checkFunction = require('../check-function')

module.exports = async () => {
  if (no_cli_flags || options_keys.includes('--cryptcheck')) {
    const name = 'CryptCheck'
    async function tryBlock(page) {
      await page._client.send('Emulation.clearDeviceMetricsOverride')
      // alternatively use https://cryptcheck.fr/https/
      await page.goto('https://tls.imirhil.fr/https/' + url)
      await page.waitForSelector('body > #flash + [class="container"]:not([id])', { timeout: 120000 })
      await page.waitForSelector('header')
      await page.evaluate(() => document.querySelector('header').style.display = 'none')
      await page.emulateMediaType('screen')
      await page.pdf({ path: path.resolve(output_path, './cryptcheck.pdf'), format: 'A4', printBackground: true })
    }
    await checkFunction(name, tryBlock)
  }
}

module.exports.help = `
  --cryptcheck
  Runs the Cryptcheck check
`