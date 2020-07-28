'use strict';

module.exports = () => {
  let dateInstance =  new Date()
  let dateTimezoneOffset = dateInstance.getTimezoneOffset()
  dateInstance = new Date(dateInstance.getTime() - (dateTimezoneOffset * 60000))
  return dateInstance.toISOString().replace(/(:|T|\.)/g, '-').replace('Z', '')
}