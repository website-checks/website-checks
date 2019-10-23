# website-checks

[![Build Status](https://github.com/DanielRuf/website-checks/workflows/CI/badge.svg)](https://github.com/DanielRuf/website-checks/actions?workflow=CI)

`website-checks` checks websites with multiple services and generates PDF files of the reports.

These are currently:
* crt.sh
* CryptCheck
* HSTS Preload List
* HTTP Observatory
* Lighthouse
* PageSpeed Insights
* Security Headers
* SSL Decoder
* SSLLabs
* webbkoll
* webhint

## Installation

```
npm i -g danielruf/website-checks
yarn global add danielruf/website-checks
```

Only the current master and LTS releases of NodeJS are tested.  
NodeJS >=10.12.0 is recommended.

## Usage

`website-checks example.com`

### Change output directory
`website-checks example.com --output pdf` would save all PDF files to the local `pdf` directory.

### CLI flags
By default all checks (except `--ssldecoder`) will run. If you want to run only specific checks you can add CLI flags.

Currently the following CLI flags will run the matching checks:
```
--crtsh
--cryptcheck
--hstspreload
--httpobservatory
--lighthouse
--psi
--securityheaders
--ssldecoder
--ssldecoder-fast
--ssllabs
--webbkoll
--webhint
```

For example `website-checks example.com --lighthouse --securityheaders` will run the Lighthouse and Security Headers checks.

## Known issues

### missing Chrome / Chromium dependency for Windows binary (.exe)

On Windows it may happen that the bundled binary throws the following error:

> UnhandledPromiseRejectionWarning: Error: Chromium revision is not downloaded. Run "npm install" or "yarn install" at Launcher.launch

This is a known issue with all solutions like `pkg` and `nexe` and expected as Chromium is not bundled with the binary which would make it much bigger.

In most cases it should be solved by globally installing `puppeteer` or by having Chrome or Chromium installed and in `PATH`.
