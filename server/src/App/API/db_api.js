
module.exports = function (app, pool) {
  const pg = require ('pg')

  const getTypes = () => {
    return new Promise((resolve, reject) => {
      //Retreiving the typesList
      var queryString = `SELECT * from "Type"`
      pool.query({
        text: queryString,
        rowMode: 'array'
      })
      .then(data => resolve(data.rows))
      .catch(error => reject(error))      
    })
  }

  const getFields = () => {
    return new Promise((resolve, reject) => {
      //Retreiving the fieldsList
      queryString = `SELECT * from "Field"`
      pool.query({
        text: queryString,
        rowMode: 'array'
      })
      .then(data => resolve(data.rows))
      .catch(error => reject(error))      
    })
  }


  /*
  Execute a query
  Type:   POST
  Route:  '/api/exec'
  Body:   {
            query: 'INSERT INTO "Var" ("id","name","type") VALUES (DEFAULT,'Temperature 2','1')'
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
  app.post('/api/exec', (req, res) => {
    var queryString=req.body.query
    pool.query({
      text: queryString,
      rowMode: 'array'
    })
    .then(data => res.status(200).json({result: data, message: "Query executed"}))
    .catch(error => res.status(400).json({code: error.code, detail: error.detail, message: error.detail}))
  })



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
    var queryString=`SELECT ${req.body.fields.join(',')} FROM "${req.body.table}"`
    pool.query({
      text: queryString,
      rowMode: 'array'
    })
    .then(data => res.status(200).json({result: data.rows, message: data.rowCount + " record(s) from table \"" + req.body.table + "\" returned correctly"}))
    .catch(error => res.status(400).json({code: error.code, detail: error.detail, message: error.detail}))
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
    var queryString=`DELETE FROM "Field" WHERE parent_type = ${req.body.id}; DELETE FROM "Type" WHERE id = ${req.body.id}`
    pool.query({
      text: queryString,
      rowMode: 'array'
    })
    .then(data=> res.status(200).json({result: data.rows[0], message: "Record correctly removed from table \"" + req.body.table + "\" "}))
    .catch(error => res.status(400).json({code: error.code, detail: error.detail, message: error.detail}))
  })


  
  /*
  Read fields
  Type:   POST
  Route:  '/api/getFields'
  Body:   { type: 128 }
  Query:  SELECT * from "Field" where "parent_type" = 128
  Event:  -
  Res:    200,
          {
            "result": {
              "name": "_Act",
              "type": 6,
              "fields": [
                  {
                      "id": 3,
                      "name": "Value",
                      "type": 1,
                      "QRef": 0
                  }
              ],
              "deps": [
                  6,
                  9,
                  10
              ]
            },
            "message": "Record(s) from table \"Field\" returned correctly"
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

  const getDeps = (type) => {
    console.log(type)
    return new Promise((resolve, reject) => {
      var response = {
        name: "",
        type: type,
        fields: [],
        deps: []
      }
      var queryString=`SELECT name FROM "Type" WHERE id = ${type}`
      pool.query({
        text: queryString,
        rowMode: 'array'
      })
      .then((name) => { 
        response.name = name.rows[0][0]
        var queryString=`SELECT * FROM "Field" WHERE parent_type = ${type}`
        pool.query({
          text: queryString,
          rowMode: 'array'
        })
        .then(data=>{
          response.fields = data.rows.map((field, i) => ({id: field[0], name: field[1], type: field[2], QRef: i}))
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
          .then(data => {
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
            .then(data => {
              //creating the Graph of the dependencies of the types
              var graph = {}
              //for each row of the previous query, non ricordo cosa ritorna la query... fuck! Questa va commentata
              result.forEach(k => graph[k[0]] = result.filter(i => i[0] == k[0]).map(j => j[1]))
              data.rows.map(k => graph[k[0]] = [])
              response.deps = [...DFS(graph, type)]       //Spread operator, DSF returns a Set, I want an array
              resolve(response)
            })
            .catch(error => reject(error))
          })
          .catch(error => reject(error))
        })
        .catch(error => reject(error))
      })
      .catch(error => reject(error))
    })
  }


  app.post('/api/getFields', (req, res) => {
    getDeps(req.body.type)
    .then(response =>  res.status(200).json({result: response, message: "Record(s) from table \"Field\" returned correctly"}))
    .catch(error => res.status(400).json({code: error.code, detail: error.detail, message: error.detail}))    
  })

  
  /*
  0: real
  1: bool
  2: _Set
  3: _Act
  4: _Limit
  5: Set
  6: Act
  7: SetAct

  Creo una Var "Power" di tipo SetAct:
  Power: {
    Set: {
      InputValue: 0.0,
      Value: 0.0
    },
    Act: {
      Value: 0.0
    },
    Limit: {
      Min: 0.0,
      Max: 0.0
    },
  }

  devo generare tutte le tag che la compongono:
  (PK) = Var (FK) + TypeField (FK)      Name                    Var (FK)          Parent Tag (IFK)   TypeField (FK)  Value
                                        Power                   Power(id)         NULL               7               NULL
                                        Power.Set               Power(id)         10                 2               NULL
                                        Power.Act               Power(id)         10                 3               NULL
                                        Power.Limit             Power(id)         10                 4               NULL
                                        Power.Set.InputValue    Power(id)         11                 8               0
                                        Power.Set.Value         Power(id)         11                 9               0
                                        Power.Act.Value         Power(id)         12                 6               0
                                        Power.Limit.Min         Power(id)         13                 5               0
                                        Power.Limit.Max         Power(id)         13                 8               0

  For each t in Types
    Select_One parent_type from Fields where type == t
  */


  const _GenerateTags = (varId, name, type, typesList, fieldsList, parent_tag) => {
    //Iterate through the types tree until it reaches the leaves, generating the tags
    fieldsList.filter(i => i[3] === type).forEach(f => {
      var tagName = name+'.'+f[1]
      var queryString=`INSERT INTO "Tag" (id, name, var, parent_tag, type_field) VALUES (DEFAULT, '${tagName}', ${varId}, ${parent_tag}, ${f[0]}) RETURNING "id"`
      pool.query({
        text: queryString,
        rowMode: 'array'
      })
      .then(data => {
        var _base_type = typesList.find(i => i[0] === f[2])
        _base_type = _base_type[2]
        if (!_base_type){
          _GenerateTags(varId, tagName, f[2], typesList, fieldsList, data.rows[0][0])
        }
      })
      //.catch(error => res.status(400).json({code: error.code, detail: error.detail, message: error.detail}))
      return
    })
  }

  const GenerateTags = (varId, varName, varType, typesList, fieldsList) => {
    return new Promise((resolve, reject) => {
      //Delete old tags
      var queryString = `DELETE FROM "Tag" WHERE var = ${varId}`
      pool.query({
        text: queryString,
        rowMode: 'array'
      })
      .then(() => {
        //Inserting the first Tag corresponding to the var
        queryString=`INSERT INTO "Tag" (id, name, var, parent_tag, type_field) VALUES (DEFAULT, '${varName}', ${varId}, NULL,  NULL) RETURNING "id"`
        console.log("2nd Insert (Main Tag): ", queryString)
        pool.query({
          text: queryString,
          rowMode: 'array'
        })
        .then(data => {
          var _base_type = typesList.find(i => i[0] === varType)
          _base_type = _base_type[2]
          //If is not a base type, we must generate all the sub tags iterating all the items
          if (!_base_type){
            _GenerateTags(varId, varName, varType, typesList, fieldsList, data.rows[0][0])
          }
          resolve()
        })
        .catch(error => reject(error))
      })
      .catch(error => reject(error))
    })
  }

  /*
  Add a Var
  Type:   POST
  Route:  '/api/addVar'
  Body:   {
            fields: [ 'name', 'type' ],
            values: [ 'Power', 7 ]      //Type: SetAct
          }
  Query:  
        DO $$ 
          DECLARE
            varId "Var".id%TYPE;
            parentTagId "Tag".id%TYPE;
          BEGIN
            INSERT INTO "Var" (id, name, type) VALUES (DEFAULT, 'Power', 7) RETURNING id into varId;
            INSERT INTO "Tag" (id, name, var, parent_tag, type_field, value) VALUES (DEFAULT, 'Power', varId, NULL, '52', NULL) RETURNING id INTO parentTagId;
        END $$

  */

  app.post('/api/addVar', (req, res) => {
    var varId, typesList, fieldsList
    var varName = req.body.name
    var varType = req.body.type
    //Retreiving the typesList
    var queryString = `SELECT * from "Type"`
    pool.query({
      text: queryString,
      rowMode: 'array'
    })
    .then(data => {  
      typesList = data.rows 
      //Retreiving the fieldsList
      queryString = `SELECT * from "Field"`
      pool.query({
        text: queryString,
        rowMode: 'array'
      })
      .then(data => {  
        fieldsList = data.rows 
        //Inserting the Var
        queryString = `INSERT INTO "Var" (id, name, type) VALUES (DEFAULT, '${varName}', ${varType}) RETURNING "id"`
        console.log("1st Insert (Var): ", queryString)
        pool.query({
          text: queryString,
          rowMode: 'array'
        })
        .then(data => {
          varId = data.rows[0][0]
          GenerateTags(varId, varName, varType, typesList, fieldsList)
          .catch(error => res.status(400).json({code: error.code, detail: error.detail, message: error.detail}))
        })
        .catch(error => res.status(400).json({code: error.code, detail: error.detail, message: error.detail}))
      })
      .catch(error => res.status(400).json({code: error.code, detail: error.detail, message: error.detail}))
    })
    .catch(error => res.status(400).json({code: error.code, detail: error.detail, message: error.detail}))
  })

  /*
  Modify a Var
  Type:   POST
  Route:  '/api/modifyVar'
  Body:   {
            fields: [ 'name', 'type' ],
            values: [ 'Power', 7 ]      //Type: SetAct
          }
  Query:  
        DO $$ 
          DECLARE
            varId "Var".id%TYPE;
            parentTagId "Tag".id%TYPE;
          BEGIN
            INSERT INTO "Var" (id, name, type) VALUES (DEFAULT, 'Power', 7) RETURNING id into varId;
            INSERT INTO "Tag" (id, name, var, parent_tag, type_field, value) VALUES (DEFAULT, 'Power', varId, NULL, '52', NULL) RETURNING id INTO parentTagId;
        END $$

  */



  app.post('/api/modifyVar', (req, res) => {
    var varId, typesList, fieldsList
    var varName = req.body.name
    var varType = req.body.type
    //Delete old tags
    var queryString = `SELECT * from "Type"`
    pool.query({
      text: queryString,
      rowMode: 'array'
    })
    .then(data => {  
      typesList = data.rows 
      //Retreiving the fieldsList
      queryString = `SELECT * from "Field"`
      pool.query({
        text: queryString,
        rowMode: 'array'
      })
      .then(data => {  
        fieldsList = data.rows 
        //Inserting the Var
        queryString=`UPDATE "Var" SET name = '${varName}', type = ${varType} WHERE id = ${req.body.id}`
        console.log("1st Insert (Var): ", queryString)
        pool.query({
          text: queryString,
          rowMode: 'array'
        })
        .then(() => {
          varId = req.body.id
          GenerateTags(varId, varName, varType, typesList, fieldsList)
          .catch(error => res.status(400).json({code: error.code, detail: error.detail, message: error.detail}))
        })
        .catch(error => res.status(400).json({code: error.code, detail: error.detail, message: error.detail}))
      })
      .catch(error => res.status(400).json({code: error.code, detail: error.detail, message: error.detail}))
    })
    .catch(error => res.status(400).json({code: error.code, detail: error.detail, message: error.detail}))
  })


  /*
  Delete a var
  Type:   POST
  Route:  '/api/removeVar'
  Body:   { id: 126 }
  Query:  DELETE FROM "Var" WHERE "id" = 126
  Event:  {
            operation: 'DELETE',
            table: 'Var',
            data: { id: 126, type: 1, name: 'Temperature 4' }
          }
  Res:    200
  Err:    400
  */
  app.post('/api/removeVar', (req, res) => {
    var queryString=`DELETE FROM "Var" WHERE id = ${req.body.id}`
    pool.query({
      text: queryString,
      rowMode: 'array'
    })
    .then(data=>{
      res.status(200).json({result: data.rows, message: "Record correctly removed from table \"" + req.body.table + "\" "})
    })
    .catch(error => res.status(400).json({code: error.code, detail: error.detail, message: error.detail}))
  })


  /*
  Refresh tags
  Type:   POST
  Route:  '/api/refreshTags'
  Body:   { id: 126 }
  Query:  DELETE FROM "Var" WHERE "id" = 126
  Event:  {
            operation: 'DELETE',
            table: 'Var',
            data: { id: 126, type: 1, name: 'Temperature 4' }
          }
  Res:    200
  Err:    400
  */
  app.post('/api/refreshTags', (req, res) => {
    var varId, varName, varType, typesList, fieldsList
    getTypes()
    .then(data => {
      typesList = data.rows
      getFields()
      .then(data => {
        fieldsList = data.rows
        getDeps(req, res)
        .then(result => {
          result.deps.forEach(type => {
            // per ogni var di questo tipo bisogna rigenerare le tags => faccio diventare la generate tags una Promise?
            var queryString=`SELECT id, name, type FROM "Var" WHERE type = ${type[0]}`
            pool.query({
              text: queryString,
              rowMode: 'array'
            })
            .then(data => {
              data.rows.forEach(v => {
                varId = v[0]
                varName = v[1]
                varType = v[2]
                GenerateTags(varId, varName, varType, typesList, fieldsList)
                .catch(error => res.status(400).json({code: error.code, detail: error.detail, message: error.detail}))
              })
            })
            .catch(error => res.status(400).json({code: error.code, detail: error.detail, message: error.detail}))
          })
        })
        .catch(error => res.status(400).json({code: error.code, detail: error.detail, message: error.detail}))
      })
      .catch(error => res.status(400).json({code: error.code, detail: error.detail, message: error.detail}))
    })
    .catch(error => res.status(400).json({code: error.code, detail: error.detail, message: error.detail}))
  })



}