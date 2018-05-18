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

(async() => {
  const browser = await puppeteer.launch({headless: true})
  const page = await browser.newPage()
  await page._client.send('Emulation.clearDeviceMetricsOverride')
  let warning
  let intervalID
  await page.goto('https://www.ssllabs.com/ssltest/analyze.html?d='+url+'&hideResults=on&ignoreMismatch=on&clearCache=on')
  try {
    await page.waitForSelector('#warningBox', {timeout:1000})
  } catch(err){
    await goOn()
    return
  }
  try {
    warning = await page.evaluate('document.querySelector("#warningBox")')
  } catch(err) {}

  intervalID = setInterval(async ()=>{
    try{
      warning = await page.evaluate('document.querySelector("#warningBox")')
    } catch(err){}
    if(!warning){
      await goOn()
      return
    }
  }, 5000)

  async function goOn(){
    if(intervalID)clearInterval(intervalID)
    const links = await page.evaluate(() => [...document.querySelectorAll('#multiTable a')].map(link => link.href))
    const linksLength = links.length
    for(let i = 0; i < linksLength; i++){
      await page.goto(links[i])
      await page.pdf({path: './pdf-'+i+'.pdf', format: 'A4', printBackground: true})
    }
    await browser.close()
  }
  // await page.goto('https://www.ssllabs.com/ssltest/');
  // await page.type('.submitBox input[type="text"][name="d"]', 'https://google.com', {delay: 100});
  // await page.click('#hideResults')
  // await page.click('.submitBox input[type="submit"]');
})()

// @todo: logic
// page.goto(SERVICE_ENDPOINT_URL)
// new promise / async / await
// page.type(selector, string)
// page.click(selector)
// await page.emulateMedia('screen');
// await page.pdf({path: 'file.pdf'});
// promise resolve / callback