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

async function crtsh(){
  const name = 'crt.sh'
  console.log(chalk.green('[started] ' + name))
  const browser = await puppeteer.launch({headless: true})
  const page = await browser.newPage()
  await page._client.send('Emulation.clearDeviceMetricsOverride')
  await page.goto('https://crt.sh/?q=' + url)
  await page.pdf({path: './crtsh.pdf', format: 'A4', printBackground: true})
  await browser.close()
  console.log(chalk.green('[done] ' + name))
}

async function cryptcheck() {
  const name = 'CryptCheck'
  console.log(chalk.green('[started] ' + name))
  const browser = await puppeteer.launch({headless: true, args: ['--lang=en']})
  const page = await browser.newPage()
  await page._client.send('Emulation.clearDeviceMetricsOverride')
  await page.goto('https://tls.imirhil.fr/https/' + url)
  try {
    await page.waitForFunction('!document.querySelector("meta[http-equiv=\'refresh\']")',{timeout:30000})
  } catch(err){
    await browser.close()
    console.log(chalk.red('[error] ' + name), chalk.red(err))
    return
  }
  await page.evaluate(() => document.querySelector('header').style.display = 'none')
  await page.emulateMedia('screen')
  await page.pdf({path: './cryptcheck.pdf', format: 'A4', printBackground: true})
  await browser.close()
  console.log(chalk.green('[done] ' + name))
}

async function hstspreload() {
  const name = 'HSTS Preload List'
  console.log(chalk.green('[started] ' + name))
  const browser = await puppeteer.launch({headless: true})
  const page = await browser.newPage()
  await page._client.send('Emulation.clearDeviceMetricsOverride')
  await page.goto('https://hstspreload.org/?domain=' + url)
  try {
    await page.waitForSelector('#result',{timeout:30000,visible:true})
  } catch(err){
    await browser.close()
    console.log(chalk.red('[error] ' + name), chalk.red(err))
    return
  }
  await page.pdf({path: './hstspreload.pdf', format: 'A4', printBackground: true})
  await browser.close()
  console.log(chalk.green('[done] ' + name))
}

async function lighthouse(){
  const name = 'Lighthouse'
  console.log(chalk.green('[started] ' + name))
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
    console.log(chalk.red('[error] ' + name), chalk.red(err))
    return
  }
  const link = await page.evaluate(() => document.querySelector('#reportLink').href)
  await page.goto(link)
  await page.pdf({path: './lighthouse.pdf', format: 'A4', printBackground: true})
  await browser.close()
  console.log(chalk.green('[done] ' + name))
}

async function psi(){
  const name = 'PageSpeed Insights'
  console.log(chalk.green('[started] ' + name))
  const browser = await puppeteer.launch({headless: true})
  const page = await browser.newPage()
  await page._client.send('Emulation.clearDeviceMetricsOverride')
  await page.goto('https://developers.google.com/speed/pagespeed/insights/?url=' + url + '&tab=mobile')
  try {
    await page.waitForSelector('#page-speed-insights .pagespeed-results .result-tabs',{timeout:60000})
  } catch(err){
    await browser.close()
    console.log(chalk.red('[error] ' + name), chalk.red(err))
    return
  }
  await page.click('#page-speed-insights .pagespeed-results .result-tabs .goog-tab:nth-child(1)')
  await page.pdf({path: './psi-mobile.pdf', format: 'A4', printBackground: true})
  await page.click('#page-speed-insights .pagespeed-results .result-tabs .goog-tab:nth-child(2)')
  await page.pdf({path: './psi-desktop.pdf', format: 'A4', printBackground: true})
  await browser.close()
  console.log(chalk.green('[done] ' + name))
}

async function securityheaders(){
  const name = 'SecurityHeaders'
  console.log(chalk.green('[started] ' + name))
  const browser = await puppeteer.launch({headless: true})
  const page = await browser.newPage()
  await page._client.send('Emulation.clearDeviceMetricsOverride')
  await page.goto('https://securityheaders.com/?q=' + url + '&hide=on&followRedirects=on')
  await page.pdf({path: './securityheaders.pdf', format: 'A4', printBackground: true})
  await browser.close()
  console.log(chalk.green('[done] ' + name))
}

async function ssldecoder() {
  const name = 'SSL Decoder'
  console.log(chalk.green('[started] ' + name))
  const browser = await puppeteer.launch({headless: true})
  const page = await browser.newPage()
  await page._client.send('Emulation.clearDeviceMetricsOverride')
  await page.goto('https://ssldecoder.org/?host=' + url,{timeout:240000})
  const links = await page.evaluate(() => [...document.querySelectorAll('#choose_endpoint a')].map(link => link.href))
  const linksLength = links.length
  if(linksLength){
    for(let i = 0; i < linksLength; i++){
      await page.goto(links[i])
      await page.emulateMedia('screen')
      await page.pdf({path: './ssldecoder-'+i+'.pdf', format: 'A4', printBackground: true})
    }
    await browser.close()
    console.log(chalk.green('[done] ' + name))
    return
  }
  await page.emulateMedia('screen')
  await page.pdf({path: './ssldecoder.pdf', format: 'A4', printBackground: true})
  await browser.close()
  console.log(chalk.green('[done] ' + name))
}

async function ssllabs() {
  const name = 'SSLLabs'
  console.log(chalk.green('[started] ' + name))
  const browser = await puppeteer.launch({headless: true})
  const page = await browser.newPage()
  await page._client.send('Emulation.clearDeviceMetricsOverride')
  await page.goto('https://www.ssllabs.com/ssltest/analyze.html?d='+url+'&hideResults=on&ignoreMismatch=on&clearCache=on')
  try {
    await page.waitForFunction('!document.querySelector("#refreshUrl")',{timeout:240000})
  } catch(err){
    await browser.close()
    console.log(chalk.red('[error] ' + name), chalk.red(err))
    return
  }
  const links = await page.evaluate(() => [...document.querySelectorAll('#multiTable a')].map(link => link.href))
  const linksLength = links.length
  for(let i = 0; i < linksLength; i++){
    await page.goto(links[i])
    await page.pdf({path: './ssllabs-'+i+'.pdf', format: 'A4', printBackground: true})
  }
  await browser.close()
  console.log(chalk.green('[done] ' + name))
}

crtsh()
cryptcheck()
hstspreload()
lighthouse()
psi()
securityheaders()
ssldecoder()
ssllabs()