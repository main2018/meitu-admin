const isProduction = process.env.NODE_ENV === 'production'
let isMock = false
const REMOTE_ADDRESS = isProduction ? 'http://112.74.47.86:3000' : 'http://192.168.0.106:3000'

if (isProduction) isMock = false

module.exports = {
  isMock,
  REMOTE_ADDRESS
}
