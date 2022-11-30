require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const axios = require('axios')
const PORT = process.env.PORT || 3000

// Create Express Server
const app = express()
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Logging
app.use(morgan('dev'))

// Add CORS HTTP headers
app.use(cors())

// Function to log messages in console
function logger (req) {
  console.log('REQ.PROTOCOL:', req.protocol)
  console.log('REQ.HOSTNAME:', req.hostname)
  console.log('REQ.METHOD:', req.method)
  console.log('REQ.URL:', req.url)
  console.log('REQ.ORIGINALURL:', req.originalUrl) // '/admin/new?sort=desc'
  console.log('REQ.PATH:', req.path) // '/new'
  console.log('REQ.PARAMS:', req.params) // '/???'
  console.log('REQ.QUERY:', req.query)
  console.log('REQ.HEADERS:', req.headers)
  console.log('REQ.HEADERS.AUTHORIZATION:', req.headers['authorization'])
  console.log('AUTHORIZATION:', req.get('authorization'))
  console.log('CONTENT-TYPE:', req.get('content-type'))
  console.log('REQ.BODY', req.body)
}

// ATTN-PROXY
// Reroute all requests sent to /attn-proxy to https://api.attentivemobile.com/v1
// Preserve anything in the path after /attn-proxy
app.use('/attn-proxy', (req, res, next) => {
  logger(req)

  const path = req.originalUrl.replace('/attn-proxy', '')
  console.log('PATH:', path)
  const url = `https://api.attentivemobile.com/v1${path}`
  console.log('URL:', url)
  const method = req.method
  const headers = {}
  const auth = req.get('authorization')
  if (auth) headers['authorization'] = auth
  const contentType = req.get('content-type')
  if (contentType) headers['content-type'] = contentType
  const data = req.body
  console.log('DATA:', data)

  axios({
    url,
    method,
    headers,
    data
  })
    .then(function (response) {
      // handle success
      console.log('SUCCESS')
      console.log('RESPONSE.DATA:', response.data)
      res.json(response.data)
    })
    .catch(function (error) {
      // handle error
      // console.log('ERROR:', error)
      // console.log('ERROR.RESPONSE:', error.response)
      console.log('CATCH')
      console.log('ERROR:', error.response.status, error.response.statusText)
      // res.status(error.response.status).json({ error: error.response.statusText })
      res.status(error.response.status).send(error.response.statusText)
    })
    .finally(function () {
      // always executed
      console.log('FINALLY')
    })
})

// ACK CATCHALL WEBHOOK
// Catchall to acknowledge requests that don't match the paths above
app.use(/.*/, (req, res, next) => {
  logger(req)
  res.sendStatus(200)
})

// Start the Proxy Server
app.listen(PORT, () => {
  console.log(`Starting Proxy Server on port: ${PORT}`)
})
