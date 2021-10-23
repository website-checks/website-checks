'use strict';

const path = require('path')
const checkFunction = require('../check-function')

module.exports = async () => {
  if (no_cli_flags || options_keys.includes('--webhint')) {
    const name = 'webhint'
    async function tryBlock(page) {
      await page._client.send('Emulation.clearDeviceMetricsOverride')
      await page.goto('https://webhint.io/scanner/')
      await page.type('#scanner-page-scan', url)
      await page.click('#scanner-page-scan + button[type="submit"]')
      await page.waitForTimeout(1000)
      await page.waitForSelector('.scan-overview__status', { timeout: 30000, visible: true })
      await page.waitForTimeout(1000)
      await page.waitForFunction('document.querySelector(".scan-overview__progress-bar.end-animation")', { timeout: 5 * 60 * 1000 })
      await page.waitForTimeout(1000)
      await page.evaluate(() => document.querySelectorAll('.button-expand-all').forEach((el) => el.click()))
      await page.pdf({ path: path.resolve(output_path, './webhint.pdf'), format: 'A4', printBackground: true })
    }
    await checkFunction(name, tryBlock)
  }
}

module.exports.help = `
  --webhint
  Runs the webhint check
`
