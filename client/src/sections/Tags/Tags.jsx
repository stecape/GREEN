import { useState, useEffect, useContext } from "react"
import { useAddMessage } from "@react-md/alert"
import { Grid, GridCell } from '@react-md/utils'
import TagsList from './TagsList'
import gridStyles from "../../styles/Grid.module.scss"
import axios from 'axios'

import {SocketContext} from "../../Helpers/socket"

function Tags () {
  const socket = useContext(SocketContext)
  const addMessage = useAddMessage()
  const [tagsList, setTagsList] = useState([])
  const [varsList, setVarsList] = useState([])
  const [typesList, setTypesList] = useState([])
  const [fieldsList, setFieldsList] = useState([])
  const [init, setInit] = useState({types: false, fields: false, vars: false, tags: false})

  //State management
  useEffect(() => {

    //Socket listeners callbacks definition
    //on connect
    const tags_on_connect = () => {
      axios.post('http://localhost:3001/api/getAll', {table: "Type", fields:["name", "id"]})
        .then(response => {
          setTypesList(response.data.result.map((val) => ({name:val[0], id:val[1]})))
          setInit((prevState) => ({ ...prevState, types: true}))
        })
      axios.post('http://localhost:3001/api/getAll', {table: "Field", fields:["type", "id"]})
        .then(response => {
          setFieldsList(response.data.result.map((val) => ({type:val[0], id:val[1]})))
          setInit((prevState) => ({ ...prevState, fields: true}))
        })
      axios.post('http://localhost:3001/api/getAll', {table: "Var", fields:["id", "type"]})
        .then(response => {
          setVarsList(response.data.result.map((val) => ({id:val[0], type:val[1]})))
          setInit((prevState) => ({ ...prevState, vars: true}))
        })
      axios.post('http://localhost:3001/api/getAll', {table: "Tag", fields:["id", "name", "var", "type_field", "um", "value"]})
        .then(response => {
          setTagsList(response.data.result.map((val) => ({id:val[0], name:val[1], var:val[2], type_field:val[3], um:val[4], value:val[5]})))
          setInit((prevState) => ({ ...prevState, tags: true}))
        })
    }

    //on error
    const tags_on_error = (...args) => {
      const error = args[0]
      console.log(error)
    }

    //on update
    const tags_on_update = (...args) => {
      const value = args[0]      
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
      else if (value.table === "Var" && value.operation === 'INSERT') {
        var vars = varsList
        vars.push(value.data)
        setVarsList([...vars])
      }
      else if (value.table === "Tag" && value.operation === 'INSERT') {
        var tags = tagsList
        tags.push(value.data)
        setTagsList([...tags])
      }
      else if (value.table === "Tag" && value.operation === 'DELETE') {
        setTagsList([...tagsList.filter(i => i.id !== value.data.id)])
      }
      else if (value.table === "Tag" && value.operation === 'TRUNCATE') {
        setTagsList([...[]])
      }
      else if (value.table === "Tag" && value.operation === 'UPDATE') {
        var updTags = tagsList
        var index = updTags.findIndex(i => i.id === value.data.id)
        updTags[index] = value.data
        setTagsList([...updTags])
      }
    }

    //On component load request the lists
    if(init.types === false){
      axios.post('http://localhost:3001/api/getAll', {table: "Type", fields:["name", "id"]})
        .then(response => {
          setTypesList(response.data.result.map((val) => ({name:val[0], id:val[1]})))
          setInit((prevState) => ({ ...prevState, types: true}))
        })
    }
    if(init.fields === false){
      axios.post('http://localhost:3001/api/getAll', {table: "Field", fields:["type", "id"]})
        .then(response => {
          setFieldsList(response.data.result.map((val) => ({type:val[0], id:val[1]})))
          setInit((prevState) => ({ ...prevState, fields: true}))
        })
    }
    if(init.vars === false){
      axios.post('http://localhost:3001/api/getAll', {table: "Var", fields:["id", "type"]})
        .then(response => {
          setVarsList(response.data.result.map((val) => ({id:val[0], type:val[1]})))
          setInit((prevState) => ({ ...prevState, vars: true}))
          addMessage({children: response.data.message})
        })
    }
    if(init.tags === false){
      axios.post('http://localhost:3001/api/getAll', {table: "Tag", fields:["id", "name", "var", "type_field", "um",  "value"]})
        .then(response => {
          setTagsList(response.data.result.map((val) => ({id:val[0], name:val[1], var:val[2], type_field:val[3], um:val[4], value:val[5]})))
          setInit((prevState) => ({ ...prevState, tags: true}))
          addMessage({children: response.data.message})
        })
    }

    //On (re)connection request the lists
    socket.on("connect", tags_on_connect)

    //Error logging
    socket.on("error", tags_on_error)

    //react on update
    socket.on("update", tags_on_update)

    //dismantling listeners
    return () => {
      socket.off("connect", tags_on_connect)
      socket.off("error", tags_on_error)
      socket.off("update", tags_on_update)
    }
  },[init, typesList, fieldsList, varsList, tagsList, socket, addMessage])
  return (
  <>
  <Grid>
    <GridCell colSpan={12} className={gridStyles.item}>
      <TagsList typesList={typesList} fieldsList={fieldsList} tagsList={tagsList} varsList={varsList}/>
    </GridCell>
  </Grid>
  </>
)}

export default Tags