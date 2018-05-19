const pkg = require('./package.json')

console.log(pkg.name + ' ' + pkg.version)


const puppeteer = require('puppeteer')
const chalk = require('chalk')
const devices = require('puppeteer/DeviceDescriptors')
const url = process.argv[2]

if(!process.argv[2]) {
  console.log(chalk.red('No website was provided.'))
  process.exit(1)
  return
}

async function lighthouse(){
  const browser = await puppeteer.launch({headless: true})
  const page = await browser.newPage()
  await page._client.send('Emulation.clearDeviceMetricsOverride')
  await page.goto('https://lighthouse-ci.appspot.com/try')
  await page.type('#url', url)
  await page.click('.url-section .search-arrow')
  try {
    await page.waitForSelector('body.done',{timeout:60000})
  } catch(err){
    await browser.close()
  }
  const link = await page.evaluate(() => document.querySelector('#reportLink').href)
  await page.goto(link)
  await page.pdf({path: './lighthouse.pdf', format: 'A4', printBackground: true})
  await browser.close()
}

async function psi(){
  const browser = await puppeteer.launch({headless: true})
  const page = await browser.newPage()
  await page._client.send('Emulation.clearDeviceMetricsOverride')
  await page.goto('https://developers.google.com/speed/pagespeed/insights/?url='+url+'&tab=mobile')
  try {
    await page.waitForSelector('#page-speed-insights .pagespeed-results .result-tabs',{timeout:60000})
  } catch(err){
    await browser.close()
  }
  await page.click('#page-speed-insights .pagespeed-results .result-tabs .goog-tab:nth-child(1)')
  await page.pdf({path: './psi-mobile.pdf', format: 'A4', printBackground: true})
  await page.click('#page-speed-insights .pagespeed-results .result-tabs .goog-tab:nth-child(2)')
  await page.pdf({path: './psi-desktop.pdf', format: 'A4', printBackground: true})
  await browser.close()
}

async function securityheaders(){
  const browser = await puppeteer.launch({headless: true})
  const page = await browser.newPage()
  await page._client.send('Emulation.clearDeviceMetricsOverride')
  await page.goto('https://securityheaders.com/?q='+url+'&hide=on&followRedirects=on')
  await page.pdf({path: './securityheaders.pdf', format: 'A4', printBackground: true})
  await browser.close()
}

async function ssllabs() {
  const browser = await puppeteer.launch({headless: true})
  const page = await browser.newPage()
  await page._client.send('Emulation.clearDeviceMetricsOverride')
  await page.goto('https://www.ssllabs.com/ssltest/analyze.html?d='+url+'&hideResults=on&ignoreMismatch=on&clearCache=on')
  try {
    await page.waitForFunction('!document.querySelector("#refreshUrl")',{timeout:240000})
  } catch(err){
    await browser.close()
  }
  const links = await page.evaluate(() => [...document.querySelectorAll('#multiTable a')].map(link => link.href))
  const linksLength = links.length
  for(let i = 0; i < linksLength; i++){
    await page.goto(links[i])
    await page.pdf({path: './ssllabs-'+i+'.pdf', format: 'A4', printBackground: true})
  }
  await browser.close()
}

lighthouse()
psi()
ssllabs()
securityheaders()