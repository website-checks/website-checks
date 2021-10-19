'use strict';

const path = require('path')
const checkFunction = require('../check-function')

module.exports = async () => {
  if (no_cli_flags || options_keys.includes('--ssllabs')) {
    const name = 'SSLLabs'
    async function tryBlock(page) {
      await page._client.send('Emulation.clearDeviceMetricsOverride')
      await page.goto('https://www.ssllabs.com/ssltest/analyze.html?d=' + url + '&hideResults=on&ignoreMismatch=on&clearCache=on')
      await page.waitForFunction('!document.querySelector("#refreshUrl")', { timeout: 340000 })
      const links = await page.evaluate(() => [...document.querySelectorAll('#multiTable a')].map(link => link.href))
      const linksLength = links.length
      if (linksLength) {
        for (let i = 0; i < linksLength; i++) {
          await page.goto(links[i])
          await page.waitForSelector('.reportTime', { timeout: 5 * 60 * 1000 });
          await page.waitForTimeout(1000);
          await page.pdf({ path: path.resolve(output_path, './ssllabs-' + i + '.pdf'), format: 'A4', printBackground: true })
        }
      } else {
        await page.waitForSelector('.reportTime', { timeout: 5 * 60 * 1000 });
        await page.waitForTimeout(1000);
        await page.pdf({ path: path.resolve(output_path, './ssllabs.pdf'), format: 'A4', printBackground: true })
      }
    }
    await checkFunction(name, tryBlock)
  }
}

module.exports.help = `
  --ssllabs
  Runs the SSLLabs check
`
