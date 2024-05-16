'use strict';

const path = require('path')
const retry = require('../retry')
const checkFunction = require('../check-function')

// TODO: ensure UA's language is set to English
module.exports = async () => {
  if (no_cli_flags || options_keys.includes('--lighthouse')) {
    const name = 'Lighthouse'
    async function tryBlock(page) {
      await page._client.send('Emulation.clearDeviceMetricsOverride')
      await retry(() => page.goto('https://pagespeed.web.dev/'), 1000)
      await page.type('[name="url"]', url)
      const button = await page.waitForXPath(`//span[contains(text(), 'Analy')]`);
      await button.click();
      await page.waitForXPath(`//div[contains(text(), 'Report from')]`, { timeout: 30000 });
      await page.waitForTimeout(30000); // TODO: find suitable selector
      await page.pdf({ path: path.resolve(output_path, './lighthouse.pdf'), format: 'A4', printBackground: true })
    }
    await checkFunction(name, tryBlock)
  }
}

module.exports.help = `
  --lighthouse
  Runs the Lighthouse check
`