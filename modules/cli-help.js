const fs = require('fs')

module.exports = () => {
  if (options_keys.includes('--help')) {
    console.log(`
    Available options for website-checks:
    `)
    const checks = fs.readdirSync('./modules/checks')
    checks.forEach(check => {
      const help = require('./checks/' + check).help
      if (typeof help !== 'undefined') {
        console.log(help)
      }
    });
    process.exit(0)
  }
}