'use strict';

module.exports =  async () => {
  return await puppeteer.launch({
    headless: !process.argv.includes("--no-headless"), 
    // slowMo: 1000,
    args: [
      '--lang=en', 
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-sandbox' // Assuming we run dev containers on the cloud, this should be safe.
    ],
  })
}