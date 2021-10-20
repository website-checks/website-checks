'use strict';

const path = require('path')
const fs = require('fs').promises
const checkFunction = require('../check-function')
const { Analyzer } = require('hint')
const webhintConfig = {
  extends: ['web-recommended'],
  'formatters': ['html'],
  'connector': { name: 'jsdom', 'waitFor': 10000 }
}
const webhint = Analyzer.create(webhintConfig)

/**
 * Webhint saves the report with a friendly name and we need to read that file,
 * so we want to use the same process that webhint uses to create it.
 * See https://github.com/webhintio/hint/blob/main/packages/formatter-html/src/formatter.ts#L269
 */
function urlToWebhintFilename(target) {
  return target.replace(/:\/\//g, '-')
    .replace(/:/g, '-')
    .replace(/\./g, '-')
    .replace(/\//g, '-')
    .replace(/[?=]/g, '-query-')
    .replace(/-$/, '')
}

module.exports = async () => {
  if (no_cli_flags || options_keys.includes('--webhint')) {
    const name = 'webhint'
    async function tryBlock(page) {
      const reportFilePath = path.join(output_path, `/${urlToWebhintFilename(url)}.html`)
      // Webhint cannot analyze URLs without the protocol, so we use the originalUrl
      const results = await webhint.analyze(originalUrl)
      await webhint.format(results[0].problems, { output: output_path, target: url })
      await page._client.send('Emulation.clearDeviceMetricsOverride')
      const content = await fs.readFile(path.join(process.cwd(), reportFilePath), 'utf8')
      await page.setContent(content)
      await page.evaluate(() => document.querySelectorAll('.button-expand-all').forEach((el) => el.click()))
      await page.pdf({ path: path.resolve(output_path, './webhint.pdf'), format: 'A4', printBackground: true })
      // Remove the HTML file that webhint generated for a clean output folder
      await fs.unlink(reportFilePath)
    }
    await checkFunction(name, tryBlock)
  }
}

module.exports.help = `
  --webhint
  Runs the webhint check
`
