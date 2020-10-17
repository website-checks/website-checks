const path = require('path')
const checkFunction = require('../check-function')

module.exports = async () => {
  if (no_cli_flags || options_keys.includes('--yellowlab')) {
    async function tryBlock(page) {
      await page._client.send('Emulation.clearDeviceMetricsOverride')
      await page.goto('https://yellowlab.tools/', { timeout: 240000, waitUntil: "domcontentloaded" })
      await page.type(".url", url)
      await page.click(".launchBtn")
      await page.waitFor(".globalGrade", { timeout: 240000 })
      await page.pdf({ path: path.resolve(output_path, './yellow-lab-1.pdf'), format: 'A4', printBackground: true })
      await page.click("div.menuItem:nth-child(4)")
      await page.waitFor(3000);
      await page.pdf({ path: path.resolve(output_path, './yellow-lab-2.pdf'), format: 'A4', printBackground: true })
    }
    await checkFunction('Yellow Lab Tools', tryBlock)
  }
}

module.exports.help = `
  --yellowlab
  Runs the Yellow Lab Tools check
`