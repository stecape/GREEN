const vars_api = require('./Vars/vars_api')

module.exports = function (app, pool) {
  const uuid = require('uuid');  
  //You cannot keep the connection open with sequelize, so this part must be done with pg
  const pg = require ('pg')

  app.get('/', (req, res) => {
    console.log('express connection');
    res.status(200).send('<p>Express.js BackEnd Server. Ciao!</p>')
  });

  vars_api(app, pool)
}