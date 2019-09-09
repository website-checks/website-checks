const puppeteer = require('puppeteer')

const pkg = require('./package.json')
const { options, options_keys } = require('./utils/process-argv')
const urlCheck = require('./modules/url-check')
const createFolders = require('./modules/create-folders')
const setup = require('./modules/setup')
const checks = require('./modules/checks')

global.url = process.argv[2]

console.log(pkg.name + ' ' + pkg.version)
urlCheck()

global.options = options
global.options_keys = options_keys
global.puppeteer = puppeteer
global.no_cli_flags = !options_keys.length || (options_keys.length === 1 && options_keys.includes('--output'))
global.output_path = '.'
global.browser
global.open_pages = 0

createFolders()

async function runChecks() {
  browser = await setup()
  checks.crtsh()
  checks.cryptcheck()
  checks.hstspreload()
  checks.httpobservatory()
  checks.lighthouse()
  checks.psi()
  checks.securityheaders()
  checks.ssldecoder()
  checks.ssllabs()
  checks.webbkoll()
  checks.webhint()
}

runChecks()