module.exports =  async () => {
  return await puppeteer.launch({
    headless: true, 
    args: [
      '--lang=en', 
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ],
  })
}