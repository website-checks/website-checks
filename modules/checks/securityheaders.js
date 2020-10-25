'use strict';

const path = require('path')
const checkFunction = require('../check-function')

module.exports = async () => {
  if (no_cli_flags || options_keys.includes('--securityheaders')) {
    const name = 'SecurityHeaders'
    async function tryBlock(page) {
      await page._client.send('Emulation.clearDeviceMetricsOverride')
      await page.goto('https://securityheaders.com/?q=' + url + '&hide=on&followRedirects=on')
      await page.pdf({ path: path.resolve(output_path, './securityheaders.pdf'), format: 'A4', printBackground: true })
    }
    await checkFunction(name, tryBlock)
  }
}

module.exports.help = `
  --securityheaders
  Runs the SecurityHeaders check
`