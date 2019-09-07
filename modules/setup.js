module.exports =  async () => {
  return await puppeteer.launch({ headless: true, args: ['--lang=en'] })
}