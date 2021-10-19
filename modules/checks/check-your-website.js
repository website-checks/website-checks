'use strict';

const path = require('path')
const checkFunction = require('../check-function')

module.exports = async () => {
  if (no_cli_flags || options_keys.includes('--check-your-website')) {
    const name = 'Check Your Website'
    async function tryBlock(page) {
      await page._client.send('Emulation.clearDeviceMetricsOverride')
      await page.goto('https://check-your-website.server-daten.de/')
      await page.waitForSelector('[id="iD.Domainname"]', { timeout: 130000 })
      await page.type('[id="iD.Domainname"]', url)
      await page.click('#check-this')
      await page.goto('https://check-your-website.server-daten.de/?q=' + url)
      await page.waitForTimeout(10000)
      await page.waitForFunction('!document.querySelector(\'meta[http-equiv="refresh"]\')', { timeout: 340000 })
      await page.waitForTimeout(1000)
      await page.emulateMediaType('screen')
      await page.evaluate(() => document.querySelector('#sdCookieBanner').style.display = 'none')
      await page.pdf({ path: path.resolve(output_path, './check-your-website.pdf'), format: 'A4', printBackground: true })
    }
    await checkFunction(name, tryBlock)
  }
}

module.exports.help = `
  --check-your-website
  Runs the check-your-website check
`
