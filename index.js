const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')

const pkg = require('./package.json')
const { options, options_keys } = require('./utils/process-argv')
const urlCheck = require('./modules/url-check')
const createFolders = require('./modules/create-folders')
const setOutput = require('./modules/set-output')
const createDatetimeString = require('./modules/create-datetime-string')
const setup = require('./modules/setup')
const checkFunction = require('./modules/check-function')
const crtsh = require('./modules/checks/crtsh')

const url = process.argv[2]

console.log(pkg.name + ' ' + pkg.version)

urlCheck(url)

const no_cli_flags = !options_keys.length || (options_keys.length === 1 && options_keys.includes('--output'))
const datetimeString = createDatetimeString()
let output_path = '.'
let browser
let open_pages = 0

output_path = setOutput(options, output_path)
output_path = path.join(output_path, url, datetimeString)
createFolders(output_path)

async function cryptcheck() {
  const name = 'CryptCheck'
  async function tryBlock(page) {
    await page._client.send('Emulation.clearDeviceMetricsOverride')
    await page.goto('https://tls.imirhil.fr/https/' + url)
    await page.waitForFunction('!document.querySelector("meta[http-equiv=\'refresh\']")', { timeout: 30000 })
    await page.waitForSelector('header')
    await page.evaluate(() => document.querySelector('header').style.display = 'none')
    await page.emulateMedia('screen')
    await page.pdf({ path: path.resolve(output_path, './cryptcheck.pdf'), format: 'A4', printBackground: true })
  }
  await await checkFunction(name, tryBlock, browser, open_pages)
}

async function hstspreload() {
  const name = 'HSTS Preload List'
  async function tryBlock(page) {
    await page._client.send('Emulation.clearDeviceMetricsOverride')
    await page.goto('https://hstspreload.org/?domain=' + url)
    await page.waitForSelector('#result', { timeout: 30000, visible: true })
    await page.pdf({ path: path.resolve(output_path, './hstspreload.pdf'), format: 'A4', printBackground: true })
  }
  await await checkFunction(name, tryBlock, browser, open_pages)
}

async function httpobservatory() {
  const name = 'HTTP Observatory'
  async function tryBlock(page) {
    await page._client.send('Emulation.clearDeviceMetricsOverride')
    await page.goto('https://observatory.mozilla.org/analyze/' + url + '&third-party=false', { waitUntil: 'networkidle0' })
    await page.waitForFunction('!document.querySelector("#scan-progress-bar")', { timeout: 240000 })
    await page.emulateMedia('screen')
    await page.pdf({ path: path.resolve(output_path, './httpobservatory.pdf'), scale: 0.75, format: 'A4', printBackground: true })
  }
  await await checkFunction(name, tryBlock, browser, open_pages)
}

async function lighthouse() {
  const name = 'Lighthouse'
  async function tryBlock(page) {
    await page._client.send('Emulation.clearDeviceMetricsOverride')
    await page.goto('https://lighthouse-ci.appspot.com/try')
    await page.type('#url', url)
    await page.click('.url-section .search-arrow')
    await page.waitForSelector('body.done', { timeout: 60000 })
    const link = await page.evaluate(() => document.querySelector('#reportLink').href)
    await page.goto(link)
    await page.pdf({ path: path.resolve(output_path, './lighthouse.pdf'), format: 'A4', printBackground: true })
  }
  await await checkFunction(name, tryBlock, browser, open_pages)
}

async function psi() {
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
  await await checkFunction(name, tryBlock, browser, open_pages)
}

async function securityheaders() {
  const name = 'SecurityHeaders'
  async function tryBlock(page) {
    await page._client.send('Emulation.clearDeviceMetricsOverride')
    await page.goto('https://securityheaders.com/?q=' + url + '&hide=on&followRedirects=on')
    await page.pdf({ path: path.resolve(output_path, './securityheaders.pdf'), format: 'A4', printBackground: true })
  }
  await await checkFunction(name, tryBlock, browser, open_pages)
}

async function ssldecoder(fastcheck) {
  const name = 'SSL Decoder' + (fastcheck ? ' (fast)' : '')
  async function tryBlock(page) {
    await page._client.send('Emulation.clearDeviceMetricsOverride')
    await page.goto('https://ssldecoder.org/?host=' + url + '&fastcheck=' + (fastcheck ? '1' : '0'), { timeout: 240000 })
    const links = await page.evaluate(() => [...document.querySelectorAll('#choose_endpoint a')].map(link => link.href))
    const linksLength = links.length
    if (linksLength) {
      for (let i = 0; i < linksLength; i++) {
        await page.goto(links[i], { timeout: 120000 })
        await page.emulateMedia('screen')
        await page.pdf({ path: path.resolve(output_path, './ssldecoder-' + (fastcheck ? 'fast-' : '') + i + '.pdf'), format: 'A4', printBackground: true })
      }
    } else {
      await page.emulateMedia('screen')
      await page.pdf({ path: path.resolve(output_path, './ssldecoder' + (fastcheck ? 'fast-' : '') + '.pdf'), format: 'A4', printBackground: true })
    }
  }
  await await checkFunction(name, tryBlock, browser, open_pages)
}

async function ssllabs() {
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
        await page.waitFor(1000)
        await page.pdf({ path: path.resolve(output_path, './ssllabs-' + i + '.pdf'), format: 'A4', printBackground: true })
      }
    } else {
      await page.waitFor(1000)
      await page.pdf({ path: path.resolve(output_path, './ssllabs.pdf'), format: 'A4', printBackground: true })
    }
  }
  await checkFunction(name, tryBlock, browser, open_pages)
}

async function webbkoll() {
  const name = 'webbkoll'
  async function tryBlock(page) {
    await page._client.send('Emulation.clearDeviceMetricsOverride')
    await page.goto('https://webbkoll.dataskydd.net/en/check?url=' + url + '&refresh=on')
    await page.waitForFunction('window.location.href.startsWith("https://webbkoll.dataskydd.net/en/results")', { timeout: 240000 })
    await page.pdf({ path: path.resolve(output_path, './webbkoll.pdf'), format: 'A4', printBackground: true })
  }
  await checkFunction(name, tryBlock, browser, open_pages)
}

async function webhint() {
  const name = 'webhint'
  async function tryBlock(page) {
    await page._client.send('Emulation.clearDeviceMetricsOverride')
    await page.goto('https://webhint.io/scanner/')
    await page.type('#scanner-page-scan', url)
    await page.click('#scanner-page-scan + button[type="submit"]')
    await page.waitFor(1000)
    await page.waitForSelector('.scan-overview__status', { timeout: 30000, visible: true })
    await page.waitFor(1000)
    await page.waitForFunction('document.querySelector(".scan-overview__progress-bar.end-animation")', { timeout: 240000 })
    await page.waitFor(1000)
    await page.evaluate(() => document.querySelectorAll('.button-expand-all').forEach((el) => el.click()))
    await page.pdf({ path: path.resolve(output_path, './webhint.pdf'), format: 'A4', printBackground: true })
  }
  await await checkFunction(name, tryBlock, browser, open_pages)
}

async function runChecks() {
  browser = await setup(puppeteer)
  crtsh(browser, open_pages, url, output_path, no_cli_flags, options_keys)
  if (no_cli_flags || options_keys.includes('--cryptcheck')) cryptcheck()
  if (no_cli_flags || options_keys.includes('--hstspreload')) hstspreload()
  if (no_cli_flags || options_keys.includes('--httpobservatory')) httpobservatory()
  if (no_cli_flags || options_keys.includes('--lighthouse')) lighthouse()
  if (no_cli_flags || options_keys.includes('--psi')) psi()
  if (no_cli_flags || options_keys.includes('--securityheaders')) securityheaders()
  if (options_keys.includes('--ssldecoder')) ssldecoder()
  if (no_cli_flags || options_keys.includes('--ssldecoder-fast')) ssldecoder(true)
  if (no_cli_flags || options_keys.includes('--ssllabs')) ssllabs()
  if (no_cli_flags || options_keys.includes('--webbkoll')) webbkoll()
  if (no_cli_flags || options_keys.includes('--webhint')) webhint()
}

runChecks()