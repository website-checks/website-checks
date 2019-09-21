const path = require('path')
const checkFunction = require('../check-function')

module.exports = async () => {
  if (no_cli_flags || options_keys.includes('--crtsh')) {
    const name = 'crt.sh'
    async function tryBlock(page) {
      await page._client.send('Emulation.clearDeviceMetricsOverride')
      await page.goto('https://crt.sh/?q=' + url)
      await page.waitFor(1000)
      await page.pdf({ path: path.resolve(output_path, './crtsh.pdf'), format: 'A4', printBackground: true })
    }
    await checkFunction(name, tryBlock)
  }
}

module.exports.help = `
  --crtsh
  Runs the crt.sh check
`