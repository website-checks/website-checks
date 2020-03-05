module.exports =  async () => {
  return await puppeteer.launch({
    headless: true, 
    // slowMo: 1000,
    args: [
      '--lang=en', 
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ],
  })
}