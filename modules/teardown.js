'use strict';

module.exports = async () => {
  if (open_pages === 0) {
    await browser.close()
  }
  if (errors) {
    process.exit(errors)
  }
}
