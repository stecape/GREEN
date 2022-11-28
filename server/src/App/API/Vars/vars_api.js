
module.exports = function (app, pool) {
  const uuid = require('uuid');  
  //You cannot keep the connection open with sequelize, so this part must be done with pg
  const pg = require ('pg')

  //Get all Vars
  app.post('/api/getVars', (req, res) => {
    var queryString="SELECT \"" + req.body.fields.join('","') + "\" from \"" + req.body.table + "\"";
    pool.query({
      text: queryString,
      rowMode: 'array'
    }).then((data)=>{
      res.status(200).json({value: data.rows})
    })
  });

  //Insert a Var
  app.post('/api/addVar', (req, res) => {
    var queryString="INSERT INTO \"" + req.body.table + "\" (\"id\",\"" + req.body.fields.join('","') + "\") VALUES (DEFAULT,'" + req.body.values.join("','") + "')"
    console.log (queryString)
    pool.query({
      text: queryString,
      rowMode: 'array'
    })
    .then((result) => {
      //console.log("setTag result: ", result.rows)
      res.status(201).json(result.rows)
    })
    .catch((error) => {
      //console.log("setTag error: ", error)
      res.status(400).send(error)
    });
  });

}