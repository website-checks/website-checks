const pkg = require('./package.json')

console.log(pkg.name + ' ' + pkg.version)


const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');

(async() => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  // await page.goto('https://www.ssllabs.com/ssltest/analyze.html?d=google.com&hideResults=on&ignoreMismatch=on&clearCache=on');
  // await page.goto('https://www.ssllabs.com/ssltest/');
  // await page.type('.submitBox input[type="text"][name="d"]', 'https://google.com', {delay: 100});
  // await page.click('#hideResults')
  // await page.click('.submitBox input[type="submit"]');

  await browser.close();
})();
// @todo: logic
// page.goto(SERVICE_ENDPOINT_URL)
// new promise / async / await
// page.type(selector, string)
// page.click(selector)
// await page.emulateMedia('screen');
// await page.pdf({path: 'file.pdf'});
// promise resolve / callback