'use strict';

const fs = require('fs')
const path = require('path')

module.exports = () => {
  if (options_keys.includes('--help')) {
    console.log(`
    Available options for website-checks:
    `)
    const dirPath = path.resolve(__dirname, 'checks')
    const checks = fs.readdirSync(dirPath)
    checks.forEach(check => {
      const help = require('./checks/' + check).help
      if (typeof help !== 'undefined') {
        console.log(help)
      }
    });
    process.exit(0)
  }
}