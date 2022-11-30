module.exports = function () {
  const app_config = require('./app_config')
  const cors = require('cors')
  const express = require('express')

  const app = express()
  app.use(cors())
  app.use(express.json())
  const http = require('http')
  const server = http.createServer(app);
  const { Server } = require("socket.io")
  const io = new Server(server, { cors: { origin: '*' } })

  const connection = io.on('connect', s => {
    console.log('socket.io connection', s.id)
    return s
  });
   
  server.listen(app_config.ws_port, () => console.log('listening on http://localhost:'+app_config.ws_port+'/'));
  return {connection: connection, expressApp:app}
}