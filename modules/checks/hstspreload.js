const path = require('path')
const checkFunction = require('../check-function')

module.exports = async () => {
  if (no_cli_flags || options_keys.includes('--hstspreload')) {
    const name = 'HSTS Preload List'
    async function tryBlock(page) {
      await page._client.send('Emulation.clearDeviceMetricsOverride')
      await page.goto('https://hstspreload.org/?domain=' + url)
      await page.waitForSelector('#result', { timeout: 30000, visible: true })
      await page.pdf({ path: path.resolve(output_path, './hstspreload.pdf'), format: 'A4', printBackground: true })
    }
    await checkFunction(name, tryBlock)
  }
}