'use strict';

module.exports =  async () => {
  return await puppeteer.launch({
    headless: !process.argv.includes("--no-headless"), 
    // slowMo: 1000,
    args: [
      '--lang=en', 
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  })
}