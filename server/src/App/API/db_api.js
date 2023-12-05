
module.exports = function (app, pool) {
  const pg = require ('pg')



  /*
  Get all records
  Type:   POST
  Route:  '/api/getAll'
  Body:   { 
            table: 'Var',
            fields: [ 'name', 'type', 'id' ]
          }
  Query:  SELECT "name","type","id" from "Var"
  Event:  -
  Res:    200,
          {
            value: [
              [ 'Temperature 1', 1, 131 ],
              [ 'Temperature 2', 1, 124 ],
              [ 'Temperature 3', 3, 125 ]
            ]
          }
  Err:    400
  */
  app.post('/api/getAll', (req, res) => {
    var queryString="SELECT \"" + req.body.fields.join('","') + "\" from \"" + req.body.table + "\""
    pool.query({
      text: queryString,
      rowMode: 'array'
    })
    .then((data)=>{
      res.status(200).json({result: data.rows, message: data.rowCount + " record(s) from table \"" + req.body.table + "\" returned correctly"})
    })
    .catch((error) => {
      res.status(400).json({code: error.code, detail: error.detail, message: error.detail})
    })
  })



  /*
  Add a record
  Type:   POST
  Route:  '/api/add'
  Body:   {
            table: 'Var',
            fields: [ 'name', 'type' ],
            values: [ 'Temperature 2', '1' ]
          }
  Query:  INSERT INTO "Var" ("id","name","type") VALUES (DEFAULT,'Temperature 2','1')
  Event:  {
            operation: 'INSERT',
            table: 'Var',
            data: { id: 133, type: 1, name: 'Temperature 2' }
          }
  Res:    200
  Err:    400
  */
  app.post('/api/add', (req, res) => {
    var queryString="INSERT INTO \"" + req.body.table + "\" (\"id\",\"" + req.body.fields.join('","') + "\") VALUES (DEFAULT,'" + req.body.values.join("','") + "') RETURNING \"id\",\"" + req.body.fields.join('","') + "\""
    pool.query({
      text: queryString,
      rowMode: 'array'
    })
    .then((data) => {
      res.status(200).json({result: data.rows[0], message: "Record correctly inserted in table \"" + req.body.table + "\" "})
    })
    .catch((error) => {
      error.code == '23505' ? res.status(400).json({code: error.code, detail: error.detail, message: error.detail}) : res.status(400).json({code: error.code, detail: "", message: 'Generic error: ' + error.code})
    })
  })



  /*
  Add many records for one ID
  Type:   POST
  Route:  '/api/addMany'
  Body:   {
            table: 'TypeDependencies',
            fields: [ 'type', 'dependant_type' ],
            values: [ '1', '2', '3' ]
          }
  Query:  INSERT INTO "TypeDependencies" ("id","type","dependant_type") VALUES (DEFAULT,'5',unnest(array[ '1', '2', '3' ]))
  Event:  {
            operation: 'INSERT',
            table: 'Var',
            data: { id: 133, type: 1, name: 'Temperature 2' }
          }
  Res:    200
  Err:    400
  */
  app.post('/api/addMany', (req, res) => {
    var queryString="INSERT INTO \"" + req.body.table + "\" (\"id\",\"" + req.body.fields.join('","') + "\") VALUES (DEFAULT,'" + req.body.id + "', unnest(array[" + req.body.values.join(',') + "]))"
    pool.query({
      text: queryString,
      rowMode: 'array'
    })
    .then((data) => {
      res.status(200).json({result: data.rows, message: "Record correctly inserted"})
    })
    .catch((error) => {
      error.code == '23505' ? res.status(400).json({code: error.code, detail: error.detail, message: error.detail}) : res.status(400).json({code: error.code, detail: "", message: 'Generic error: ' + error.code})
    })
  })



  /*
  Delete all records
  Type:   POST
  Route:  '/api/removeAll'
  Body:   { table: 'Var'}
  Query:  TRUNCATE "Var" CASCADE
  Event:  { operation: 'TRUNCATE', table: 'Var' }
          { operation: 'TRUNCATE', table: 'Tag' }
  Res:    200
  Err:    400
  */
  app.post('/api/removeAll', (req, res) => {
    var queryString="TRUNCATE \"" + req.body.table + "\" CASCADE"
    pool.query({
      text: queryString
    })
    .then((data)=>{
      res.status(200).json({result: data.rows, message: "Records correctly removed from table \"" + req.body.table + "\" "})
    })
    .catch((error) => {
      res.status(400).json({code: error.code, detail: error.detail, message: error.detail})
    })
  })



  /*
  Delete a record
  Type:   POST
  Route:  '/api/removeOne'
  Body:   { table: 'Var', id: 126 }
  Query:  DELETE FROM "Var" WHERE "id" = 126
  Event:  {
            operation: 'DELETE',
            table: 'Var',
            data: { id: 126, type: 1, name: 'Temperature 4' }
          }
  Res:    200
  Err:    400
  */
  app.post('/api/removeOne', (req, res) => {
    var queryString="DELETE FROM \"" + req.body.table + "\" WHERE \"id\" = " + req.body.id
    pool.query({
      text: queryString,
      rowMode: 'array'
    })
    .then((data)=>{
      res.status(200).json({result: data.rows, message: "Record correctly removed from table \"" + req.body.table + "\" "})
    })
    .catch((error) => {
      res.status(400).json({code: error.code, detail: error.detail, message: error.detail})
    })
  })



  /*
  Delete a TYPE
  Type:   POST
  Route:  '/api/removeType'
  Body:   { id: 182 }
  Query:  DELETE FROM "TypeDependencies" WHERE "type" = 182; DELETE FROM "Field" WHERE "type" = 182; DELETE FROM "Type" WHERE "id" = 182
  Event:  {
            operation: 'DELETE',
            table: 'Type',
            data: { id: 182, name: 'Prova' }
          }
  Res:    200
  Err:    400
  */
  app.post('/api/removeType', (req, res) => {
    var queryString="DELETE FROM \"TypeDependencies\"  WHERE \"type\" = " + req.body.id + "; DELETE FROM \"Field\"  WHERE \"parent_type\" = " + req.body.id + "; DELETE FROM \"Type\" WHERE \"id\" = " + req.body.id
    pool.query({
      text: queryString,
      rowMode: 'array'
    })
    .then((data)=>{
      res.status(200).json({result: data.rows[0], message: "Record correctly removed from table \"" + req.body.table + "\" "})
    })
    .catch((error) => {
      res.status(400).json({code: error.code, detail: error.detail, message: error.detail})
    })
  })


  
  /*
  Modify a record
  Type:   POST
  Route:  '/api/modify'
  Body:   {
            table: 'Var',
            id: 128,
            fields: [ 'name', 'type' ],
            values: [ 'Temperature 5', '4' ]
          }
  Query:  UPDATE "Var" SET "name" = 'Temperature 5',"type" = '4' WHERE id = 128
  Event:  {
            operation: 'UPDATE',
            table: 'Var',
            data: { id: 128, type: 4, name: 'Temperature 5' }
          }
  Res:    200
  Err:    400
  */
  app.post('/api/modify', (req, res) => {
    var sets = req.body.fields.map((i, index) => {
       return "\"" + i + "\" = '" + req.body.values[index] + "'"
    })
    var queryString="UPDATE \"" + req.body.table + "\" SET " + sets + " WHERE id = " + req.body.id
    pool.query({
      text: queryString,
      rowMode: 'array'
    })
    .then((data) => {
      res.status(200).json({result: data.rows[0], message: "Type \"" + req.body.values[0] + "\" correctly modified"})
    })
    .catch((error) => {
      res.status(400).json({code: error.code, detail: error.detail, message: error.detail})
    })
  })


  
  /*
  Read fields
  Type:   POST
  Route:  '/api/getFields'
  Body:   {
            table: 'Field',
            type: 128
          }
  Query:  SELECT * from "Field" where "parent_type" = 128
  Event:  -
  Res:    200,
          {
            value: [
              [ 'Temperature 1', 1, 131 ],
              [ 'Temperature 2', 1, 124 ],
              [ 'Temperature 3', 3, 125 ]
            ]
          }
  Err:    400
  */
 

  const DFS = (graph, typeId, visited = undefined, depthCounter = undefined) => {
    if (visited == undefined) {
      visited = new Set()
    }
    if (depthCounter == undefined) {
      depthCounter = 0
    }
    visited.add(typeId)
    depthCounter++
    graph[typeId]
      .filter((item) => !visited.has(item))
      .forEach((parent) => DFS(graph, parent, visited, depthCounter))
    depthCounter--
    if (depthCounter == 0) {
      return visited
    }
  }


  app.post('/api/getFields', (req, res) => {
    var response = {
      name: "",
      type: req.body.type,
      fields: [],
      deps: []
    }
    var queryString="SELECT \"name\" from \"Type\" where \"id\" = " + req.body.type
    pool.query({
      text: queryString,
      rowMode: 'array'
    })
    .then((name) => { 
      response.name = name.rows[0][0]
      var queryString="SELECT * from \"Field\" where \"parent_type\" = " + req.body.type
      pool.query({
        text: queryString,
        rowMode: 'array'
      })
      .then((data)=>{
        response.fields = data.rows.map((field) => ({id: field[0], name: field[1], type: field[2]}))
        var result = []
        var queryString=`
        SELECT
        distinct "Type".id, "Field".parent_type
        FROM "Type"
        INNER JOIN "Field" ON "Field".type="Type".id
        ORDER by id
        `
        pool.query({
          text: queryString,
          rowMode: 'array'
        })
        .then((data) => {
          result = data.rows
          var queryString=`
            SELECT
            distinct "Field".parent_type
            FROM "Field"
            LEFT JOIN (
              SELECT
              distinct "Type".id
              FROM "Type"
              INNER JOIN "Field" ON "Field".type="Type".id
            ) a ON a.id = "Field".parent_type
            WHERE a.id IS NULL
          `
          pool.query({
            text: queryString,
            rowMode: 'array'
          })
          .then((data) => {
            var graph = {}
            result.map(k => graph[k[0]] = result.filter(i => i[0] == k[0]).map(j => j[1]))
            data.rows.map(k => graph[k[0]] = [])
            response.deps = [...DFS(graph, req.body.type)]       //Spread operator, DSF returns a Set, I want an array
            res.status(200).json({result: response, message: "Record(s) from table \"Field\" returned correctly"})
          })
        })
      })
    })
    .catch((error) => {
      res.status(400).json({code: error.code, detail: error.detail, message: error.detail})
    })
  })



  /*
  Add many fields for one type
  Type:   POST
  Route:  '/api/addFields'
  Body:   {
            parent_type: 396,
            fields: [ 'name', 'type', 'parent_type' ],
            values: [ [ 'Set', 394 ], [ 'Act', 395 ] ]
          }
  Query:  INSERT INTO "Field" ("id","parent_type","name","type") VALUES (DEFAULT,'396','Set',394),(DEFAULT,'396','Act',395)
  Event:  {
            operation: 'INSERT',
            table: 'Field',
            data: { id: 9, name: 'Set', type: 394, parent_type: 396 }
          }
          {
            operation: 'INSERT',
            table: 'Field',
            data: { id: 10, name: 'Act', type: 395, parent_type: 396 }
          }
  Res:    200
  Err:    400
  */
  app.post('/api/addFields', (req, res) => {
    console.log(req.body.values)
    var queryString="INSERT INTO \"Field\" (\"id\",\"" + req.body.fields.join('","') + "\") VALUES "
    queryString += req.body.values.map((field) =>"(DEFAULT,'" + req.body.id + "','" + field[0] + "'," + field[1] +")").join(",")
    pool.query({
      text: queryString,
      rowMode: 'array'
    })
    .then((data) => {
      res.status(200).json({result: data.rows, message: "Record correctly inserted"})
    })
    .catch((error) => {
      error.code == '23505' ? res.status(400).json({code: error.code, detail: error.detail, message: error.detail}) : res.status(400).json({code: error.code, detail: "", message: 'Generic error: ' + error.code})
    })
  })



  /*
  Get Type dependency graph
  Type:   POST
  Route:  '/api/getTypeGraph'
  Body:   -
  Query:  INSERT INTO "Field" ("id","parent_type","name","type") VALUES (DEFAULT,'396','Set',394),(DEFAULT,'396','Act',395)
  Event:  {
            operation: 'INSERT',
            table: 'Field',
            data: { id: 9, name: 'Set', type: 394, parent_type: 396 }
          }
  Res:    200
  Err:    400
  */


  app.post('/api/getTypeDeps', (req, res) => {
    var result = []
    var queryString=`
    SELECT
    distinct "Type".id, "Field".parent_type
    FROM "Type"
    INNER JOIN "Field" ON "Field".type="Type".id
    ORDER by id
    `
    pool.query({
      text: queryString,
      rowMode: 'array'
    })
    .then((data) => {
      result = data.rows
      var queryString=`
        SELECT
        distinct "Field".parent_type
        FROM "Field"
        LEFT JOIN (
          SELECT
          distinct "Type".id
          FROM "Type"
          INNER JOIN "Field" ON "Field".type="Type".id
        ) a ON a.id = "Field".parent_type
        WHERE a.id IS NULL
      `
      pool.query({
        text: queryString,
        rowMode: 'array'
      })
      .then((data) => {
        var graph = {}
        result.map(k => graph[k[0]] = result.filter(i => i[0] == k[0]).map(j => j[1]))
        data.rows.map(k => graph[k[0]] = [])
        var parents = [...DFS(graph, req.body.id)]       //Spread operator, DFS returns a Set, I want an array  
        res.status(200).json({result: parents, message: "Record correctly returned"})          
      })
    })
    .catch((error) => {
      error.code == '23505' ? res.status(400).json({code: error.code, detail: error.detail, message: error.detail}) : res.status(400).json({code: error.code, detail: "", message: 'Generic error: ' + error.code})
    })
  })
}