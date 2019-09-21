const path = require('path')
const checkFunction = require('../check-function')

module.exports = async () => {
  if (no_cli_flags || options_keys.includes('--psi')) {
    const name = 'PageSpeed Insights'
    async function tryBlock(page) {
      await page._client.send('Emulation.clearDeviceMetricsOverride')
      await page.goto('https://developers.google.com/speed/pagespeed/insights/?url=' + url + '&tab=mobile')
      await page.waitForSelector('#page-speed-insights .pagespeed-results .result-tabs', { timeout: 60000 })
      await page.click('#page-speed-insights .pagespeed-results .result-tabs .goog-tab:nth-child(1)')
      await page.pdf({ path: path.resolve(output_path, './psi-mobile.pdf'), format: 'A4', printBackground: true })
      await page.click('#page-speed-insights .pagespeed-results .result-tabs .goog-tab:nth-child(2)')
      await page.pdf({ path: path.resolve(output_path, './psi-desktop.pdf'), format: 'A4', printBackground: true })
    }
    await checkFunction(name, tryBlock)
  }
}

module.exports.help = `
  --psi
  Runs the PageSpeed Insights check
`