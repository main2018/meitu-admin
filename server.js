var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var router = express.Router()
var axios = require('axios')
const REMOTE_ADDRESS = 'http://112.74.47.86:3000'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false })) // 以下为路由配置
app.use(cookieParser())

axios.defaults.timeout = 15000
router.post('/dispatch/*', function(req, res, next) {
  ajax('POST', req, res)
})
router.get('/dispatch/*', function(req, res, next) {
  ajax('GET', req, res)
})

function ajax(method, req, res) {
  var data = method === 'POST' ? req.body : null
  const url = REMOTE_ADDRESS + req.path.replace('/dispatch', '')
  const accessToken = req.cookies.accessToken || ''
  axios({
    method,
    withCredentials: true, // send cookies when cross-domain requests
    url,
    data,
    headers: {
      Authorization: accessToken
    }
  })
    .then(resp => {
      res.send(resp && resp.data)
      res.end()
    })
    .catch(err => {
      res.status(500).json({ success: false, data: err })
    })
}
app.use(router)

app.use(require('connect-history-api-fallback')())
app.use(express.static('./dist'))

module.exports = app.listen(8099, function(err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost: 8099 \n')
})
