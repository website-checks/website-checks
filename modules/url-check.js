'use strict';

const { red } = require('kleur')

module.exports = () => {
  if (!url) {
    console.log(red('No website was provided.'))
    process.exit(1)
  }
  url = url.replace(/^https?:\/\//, '')
}
