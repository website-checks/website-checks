const fs = require('fs')

module.exports = (output_path) => {
  if (!fs.existsSync(output_path)) {
    fs.mkdirSync(output_path, { recursive: true })
  }
}