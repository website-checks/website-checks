'use strict';

const fs = require('fs')
const path = require('path')
const setOutput = require('./set-output')
const createDatetimeString = require('./create-datetime-string')

module.exports = () => {
  setOutput()
  output_path = path.join(output_path, url, createDatetimeString())
  if (!fs.existsSync(output_path)) {
    fs.mkdirSync(output_path, { recursive: true })
  }
}