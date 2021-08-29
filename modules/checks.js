'use strict';

const checkYourWebsite = require('./checks/check-your-website')
const crtsh = require('./checks/crtsh')
const cryptcheck = require('./checks/cryptcheck')
const hstspreload = require('./checks/hstspreload')
const httpobservatory = require('./checks/httpobservatory')
const lighthouse = require('./checks/lighthouse')
const psi = require('./checks/psi')
const securityheaders = require('./checks/securityheaders')
const ssllabs = require('./checks/ssllabs')
const webbkoll = require('./checks/webbkoll')
const webhint = require('./checks/webhint')
const yellowlab = require('./checks/yellowlab')

module.exports = {
    checkYourWebsite,
    crtsh,
    cryptcheck,
    hstspreload,
    httpobservatory,
    lighthouse,
    psi,
    securityheaders,
    ssllabs,
    webbkoll,
    webhint,
    yellowlab,
}