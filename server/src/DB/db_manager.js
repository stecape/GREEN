const pg = require('pg')
const db_config = require('./db_config')
const db_filler = require('./db_filler')
const db_listener = require('./db_listener')
const app_api = require('../App/API/api')
const app_ws = require('../App/app_ws')

const connStr = `${db_config.db_dialect}://${db_config.db_user}:${db_config.db_password}@${db_config.db_host}:${db_config.db_port}/${db_config.db_name}`
let pool

function createPool() {
  pool = new pg.Pool({ connectionString: connStr })
  pool.on('error', handlePoolError)
}

function handlePoolError(err) {
  console.error('handlePoolError: Unexpected error on idle client')
  console.log('handlePoolError: Retrying connection...')
  setTimeout(() => {
    createPool()
    initialize()
  }, 5000) // Retry after 5 seconds
}

function initialize() {
  return new Promise((resolve, reject) => {
    pool.connect((err, client, done) => {
      if (err) {
        console.error("Initialize: Connection error")
        reject(err)
      } else {
        console.log("Initialize: Pool connected")
        done() // Release the client back to the pool
        db_filler(pool)
          .then(() => {
            resolve(pool)
          })
          .catch((err) => {
            console.error("Initialize: Error filling the database", err)
            reject(err)
          })
      }
    })
  })
}

function startApp() {
  createPool()
  initialize()
    .then((pool) => {
      const wsRet = app_ws()
      const ReactWSConnection = wsRet.connection
      const expressApp = wsRet.expressApp
      db_listener(ReactWSConnection, pool)
        .then(() => app_api(expressApp, pool))
        .catch((err) => {
          console.error("Error setting up listeners", err)
          // Close WebSocket server before retrying
          app_ws.close()
          // Retry initialization
          setTimeout(startApp, 5000) // Retry after 5 seconds
        })
    })
    .catch((err) => {
      console.error("startApp: Initialization error")
      // Close WebSocket server before retrying
      app_ws.close()
      // Retry initialization
      setTimeout(startApp, 5000) // Retry after 5 seconds
    })
}


// Gestione globale degli errori
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception: ', err) 
  // Close WebSocket server before retrying
  app_ws.close()
  setTimeout(startApp, 5000) // Retry after 5 seconds
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  // Close WebSocket server before retrying
  app_ws.close()
  setTimeout(startApp, 5000) // Retry after 5 seconds
})

module.exports = { startApp }
