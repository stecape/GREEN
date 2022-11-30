module.exports = function () {
  const app_config = require('./app_config')
  const cors = require('cors')
  const express = require('express')
  const http = require('http')
  const { Server } = require("socket.io")

  //Express App creation
  const app = express()
  app.use(cors())
  app.use(express.json())
  const server = http.createServer(app)

  //socket.io WebSocket creation and running on the http server
  const io = new Server(server, { cors: { origin: '*' } })
  const connection = io.on('connect', s => {
    console.log('socket.io connection', s.id)
    s.on("error", (err) => console.log("Caught socket error: ", err))
    return s
  })
  
  //Start listening for http req
  server.listen(app_config.ws_port, () => console.log('listening on http://localhost:' + app_config.ws_port + '/'))
  return {connection: connection, expressApp: app}
}