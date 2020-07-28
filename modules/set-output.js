'use strict';

const fs = require('fs')
const path = require('path')
const { yellow } = require('kleur')

module.exports = () => {
  if (typeof options['--output'] !== 'undefined') {
    const dir = path.resolve(options['--output'])
    if (fs.existsSync(dir) && fs.lstatSync(dir).isDirectory()) {
      output_path = dir
    } else {
      console.warn(yellow('Path ' + dir + ' can not be resolved, falling back to ' + path.resolve(output_path)))
    }
  }
}