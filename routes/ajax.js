let express = require('express')
  , fetch = require('../utils/fetching')
  , parse = require('../utils/parsing')
  , router = express.Router()

function getForm(pathJvc, ipAddress, successCallback, failCallback) {
  fetch(pathJvc, (headers, body) => {
    let form = parse.form(body)
    if (form) {
      successCallback(form)
    }
    else {
      failCallback('parsing')
    }
  }, failCallback, ipAddress)
}

router.post('/ajax/postMessage', (req, res, next) => {
  let r = {
      error: false,
      sent: req.body,
    }
    , ipAddress = req.connection.remoteAddress

  if (!req.body.message || !req.body.pathJvc) {
    r.error = 'Missing params'
    res.json(r)
    return
  }

  let {message, pathJvc} = req.body

  getForm(pathJvc, ipAddress, (form) => {
    r.form = form
    res.json(r)
  }, (error) => {
    r.error = error
    res.json(r)
  })
})

module.exports = router
