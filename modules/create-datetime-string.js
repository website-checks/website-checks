module.exports = () => {
  return new Date().toISOString().replace(/(:|T|\.)/g, '-').replace('Z', '')
}