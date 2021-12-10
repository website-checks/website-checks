'use strict';

const path = require('path')
const retry = require('../retry')
const checkFunction = require('../check-function');
const scrollToBottom = require('../../utils/scroll-to-bottom');

module.exports = async () => {
  if (no_cli_flags || options_keys.includes('--psi')) {
    const name = 'PageSpeed Insights'
    /** @param {import("puppeteer").Page} page */
    async function tryBlock(page) {
      await page._client.send('Emulation.clearDeviceMetricsOverride')
      await retry(() => page.goto('https://developers.google.com/speed/pagespeed/insights/?url=' + url + '&tab=mobile'), 1000)
      await page.waitForFunction(() => document.body.innerText.includes("Discover what your real users are experiencing"), { timeout: 600000 })
      await (await page.$x('//span[contains(text(), "Ok, Got it.")]'))[0].click()
      await scrollToBottom(page);
      await page.waitForTimeout(3000)
      await page.pdf({ path: path.resolve(output_path, './psi-mobile.pdf'), format: 'A4', printBackground: true })
      await (await page.$x('//*[@id="desktop_tab"]/span[2]'))[0].click()
      await scrollToBottom(page);
      await page.waitForTimeout(3000)
      await page.pdf({ path: path.resolve(output_path, './psi-desktop.pdf'), format: 'A4', printBackground: true })
    }
    await checkFunction(name, tryBlock)
  }
}

module.exports.help = `
  --psi
  Runs the PageSpeed Insights check
`