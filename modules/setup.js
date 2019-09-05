module.exports =  async (puppeteer) => {
  return await puppeteer.launch({ headless: true, args: ['--lang=en'] })
}