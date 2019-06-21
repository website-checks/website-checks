# website-checks

`website-checks` checks websites with multiple services.

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