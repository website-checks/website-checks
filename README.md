# website-checks

[![Build Status](https://github.com/website-checks/website-checks/workflows/CI/badge.svg)](https://github.com/website-checks/website-checks/actions?workflow=CI)

`website-checks` checks websites with multiple services and generates PDF files of the reports.

These are currently:
* Check Your Website
* crt.sh
* CryptCheck
* HSTS Preload List
* HTTP Observatory
* Lighthouse
* PageSpeed Insights
* Security Headers
* SSLLabs
* webbkoll
* webhint
* Yellow Lab Tools

## Installation

### Node setup

Install the package:
```
yarn global add @website-checks/website-checks
# or
npm i -g @website-checks/website-checks
```

Only the current master and LTS releases of NodeJS are tested.  
NodeJS >=10.12.0 is recommended.


### Docker setup

In [docker-compose.yml](https://github.com/website-checks/website-checks/blob/0b11bb3f7218b732a15da5dcff93576f46c47416/docker-compose.yml#L5), modify the TARGET_URL variable to change the website. 

Then run:
```
docker-compose up
```

Only Docker Engine versions 18.06.0+ are supported since the Docker Compose file version is 3.7.

## Usage

`website-checks example.com`

### Change output directory
`website-checks example.com --output pdf` would save all PDF files to the local `pdf` directory.

### CLI flags
Currently the following CLI flags will run the matching checks:
```
--check-your-website
--crtsh
--cryptcheck
--hstspreload
--httpobservatory
--lighthouse
--psi
--securityheaders
--ssllabs
--webbkoll
--webhint
--yellowlab
```

For example `website-checks example.com --lighthouse --securityheaders` will run the Lighthouse and Security Headers checks.

## Known issues

### missing Chrome / Chromium dependency for Windows binary (.exe)

On Windows it may happen that the bundled binary throws the following error:

> UnhandledPromiseRejectionWarning: Error: Chromium revision is not downloaded. Run "npm install" or "yarn install" at Launcher.launch

This is a known issue with all solutions like `pkg` and `nexe` and expected as Chromium is not bundled with the binary which would make it much bigger.

In most cases it should be solved by globally installing `puppeteer` or by having Chrome or Chromium installed and in `PATH`.
