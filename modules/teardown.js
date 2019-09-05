module.exports = async (open_pages, browser) => {
  if (open_pages === 0) {
    await browser.close()
  }
}
