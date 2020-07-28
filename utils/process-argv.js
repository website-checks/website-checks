'use strict';

let options = process.argv.slice(3) || []
if (process.argv[2] === '--help') {
    options.unshift('--help')
}
const options_len = options.length;

let options_processed = {}
let options_processed_last = ''

for (let i = 0; i < options_len; i++) {
    if (!options[i].startsWith('-')) {
        options_processed[options_processed_last] = options[i];
    } else {
        let argument_kv = options[i].split('=');
        options_processed[argument_kv[0]] = argument_kv[1] ? argument_kv[1] : '';
        options_processed_last = options[i];
    }
}

options = options_processed
const options_keys = Object.keys(options)

module.exports = {
    options,
    options_keys
}