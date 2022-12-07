import { useState, useEffect, useContext } from "react"
import { Grid, GridCell } from '@react-md/utils'
import TypesList from './TypesList'
import NewType from './NewType/NewType'
import gridStyles from "../../styles/Grid.module.scss"
import axios from 'axios'

import {SocketContext} from "../../Helpers/socket"

function Types () {
  const socket = useContext(SocketContext)
  const [fieldsList, setFieldsList] = useState([])
  const [typesList, setTypesList] = useState([])
  const [init, setInit] = useState({types: false, fields: false})
  const [expanded, setExpanded] = useState(false)

  //State management
  useEffect(() => {
    //On component load request the lists
    if(init.types === false){
      axios.post('http://localhost:3001/api/getAll', {table: "Type", fields:["name", "id"]})
        .then(response => {
          setTypesList(response.data.value.map((val) => ({name:val[0], id:val[1]})))
          setInit((prevState) => ({ ...prevState, types: true}))
        })
    }
    if(init.fields === false){
      axios.post('http://localhost:3001/api/getAll', {table: "Field", fields:["name", "parent_type", "type", "id"]})
        .then(response => {
          setFieldsList(response.data.value.map((val) => ({name:val[0], type:val[1], parent_type:val[2], id:val[3]})))
          setInit((prevState) => ({ ...prevState, fields: true}))
        })
    }

    //On (re)connection request the lists
    socket.on("connect", () => {
      axios.post('http://localhost:3001/api/getAll', {table: "Type", fields:["name", "id"]})
        .then(response => {
          setTypesList(response.data.value.map((val) => ({name:val[0], id:val[1]})))
          setInit((prevState) => ({ ...prevState, types: true}))
        })
      axios.post('http://localhost:3001/api/getAll', {table: "Field", fields:["name", "type", "id"]})
        .then(response => {
          setFieldsList(response.data.value.map((val) => ({name:val[0], type:val[1], id:val[2]})))
          setInit((prevState) => ({ ...prevState, fields: true}))
        })
    })

    //Error logging
    socket.on("error", (error) => {
      console.log(error)
    })

    //react on update
    socket.on("update", (value) => {
      if (value.table === "Type" && value.operation === 'INSERT') {
        var types = typesList
        types.push(value.data)
        setTypesList([...types])
      }
      else if (value.table === "Field" && value.operation === 'INSERT') {
        var fields = fieldsList
        fields.push(value.data)
        setFieldsList([...fields])
      }
      else if (value.table === "Type" && value.operation === 'DELETE') {
        setTypesList([...typesList.filter(i => i.id !== value.data.id)])
      }
      else if (value.table === "Type" && value.operation === 'TRUNCATE') {
        setTypesList([...[]])
      }
      else if (value.table === "Type" && value.operation === 'UPDATE') {
        var updTypes = typesList
        var index = updTypes.findIndex(i => i.id === value.data.id)
        updTypes[index] = value.data
        setTypesList([...updTypes])
      }
    })

    //dismantling listeners
    return () => {
      socket.off("connect")
      socket.off("error")
      socket.off("update")
    }
  },[init, fieldsList, typesList, socket])
  return (
  <>
  <Grid>
    <GridCell colSpan={12} className={gridStyles.item}>
      <NewType typesList={typesList}/>
    </GridCell>
    <GridCell colSpan={12} className={gridStyles.item}>
      <TypesList typesList={typesList} fieldsList={fieldsList}/>
    </GridCell>
  </Grid>
  </>
)}

export default Types