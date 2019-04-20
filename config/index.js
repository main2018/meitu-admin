const isProduction = process.env.NODE_ENV === 'production'
let isMock = false

if (isProduction) isMock = false

module.exports = {
  isMock
}
