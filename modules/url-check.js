const { red } = require('kleur')

module.exports = (url) => {
  if (!url) {
    console.log(red('No website was provided.'))
    process.exit(1)
  }
}