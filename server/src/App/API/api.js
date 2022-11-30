const vars_api = require('./db_api')

module.exports = function (app, pool) {
  const pg = require ('pg')

  app.get('/', (req, res) => {
    console.log('express connection')
    res.status(200).send('<p>Express.js BackEnd Server. Ciao!</p>')
  })

  vars_api(app, pool)
}