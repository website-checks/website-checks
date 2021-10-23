'use strict';

const path = require('path')
const checkFunction = require('../check-function')

module.exports = async () => {
  if (no_cli_flags || options_keys.includes('--yellowlab')) {
    async function tryBlock(page) {
      await page._client.send('Emulation.clearDeviceMetricsOverride')
      await page.goto('https://yellowlab.tools/', { timeout: 240000, waitUntil: "domcontentloaded" })
      await page.type(".url", url)
      await page.click(".launchBtn")
      await page.waitForTimeout(".globalGrade", { timeout: 240000 })
      await page.pdf({ path: path.resolve(output_path, './yellow-lab-overview.pdf'), format: 'A4', printBackground: true })
      const categoryLength = await page.$$eval('div[ng-repeat="categoryKey in categoriesOrder"]', divs => divs.length)
      for (let i_cat = 1; i_cat <= categoryLength; i_cat++) {
        const categoryName = await page.$eval(`div[ng-repeat="categoryKey in categoriesOrder"]:nth-of-type(${i_cat})`, div => div.innerText.split("\t")[1])
        const linksLength = await page.$$eval(`div[ng-repeat="categoryKey in categoriesOrder"]:nth-of-type(${i_cat}) a`, as => as.length)
        for (let j_link = 1; j_link <= linksLength; j_link++) {
          const className = `div[ng-repeat="categoryKey in categoriesOrder"]:nth-of-type(${i_cat}) a:nth-of-type(${j_link})`
          const linkName = await page.$eval(className, div => div.innerText.split("\t")[1].replace("/", " or ").replace(" ", "-"))
          await page.click(className)
          await page.waitForTimeout(".ruleTable", { timeout: 240000 })
          await page.pdf({ path: path.resolve(output_path, `./yellow-lab-${categoryName}-${linkName}.pdf`), format: 'A4', printBackground: true })
          await page.goBack()
          await page.waitForTimeout(".globalGrade", { timeout: 240000 })
        }
      }
    }
    await checkFunction('Yellow Lab Tools', tryBlock)
  }
}

module.exports.help = `
  --yellowlab
  Runs the Yellow Lab Tools check
`
