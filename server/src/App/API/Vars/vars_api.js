
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
    pool.query({
      text: queryString,
      rowMode: 'array'
    })
    .then((result) => {
      res.status(201).json(result.rows)
    })
    .catch((error) => {
      res.status(400).send(error)
    });
  });

  //Delete all Vars
  app.post('/api/cleanVars', (req, res) => {
    var queryString="TRUNCATE \"" + req.body.table + "\" CASCADE";
    pool.query({
      text: queryString
    })
    .then((data)=>{
      res.status(200)
    })
    .catch((error) => {
      res.status(400).send(error)
    });
  });

  //Delete a Var
  app.post('/api/removeVar', (req, res) => {
    var queryString="DELETE FROM \"" + req.body.table + "\" WHERE \"id\" = " + req.body.id;
    pool.query({
      text: queryString,
      rowMode: 'array'
    })
    .then((data)=>{
      res.status(200).json({value: data.rows})
    })
    .catch((error) => {
      res.status(400).send(error)
    });
  });

  //Modify a Var
  app.post('/api/updateVar', (req, res) => {
    var sets = req.body.fields.map((i, index) => {
       return "\"" + i + "\" = '" + req.body.values[index] + "'"
    })    
    var queryString="UPDATE \"" + req.body.table + "\" SET " + sets + " WHERE id = " + req.body.id
    pool.query({
      text: queryString,
      rowMode: 'array'
    })
    .then((result) => {
      res.status(201).json(result.rows)
    })
    .catch((error) => {
      res.status(400).send(error)
    });
  });
}