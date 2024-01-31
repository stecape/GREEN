import { useState, useEffect, useContext } from "react"
import { useAddMessage } from "@react-md/alert"
import { Grid, GridCell } from '@react-md/utils'
import VarsList from './VarsList'
import gridStyles from "../../styles/Grid.module.scss"
import axios from 'axios'

import {SocketContext} from "../../Helpers/socket"

function Vars () {
  const socket = useContext(SocketContext)
  const addMessage = useAddMessage()
  const [varsList, setVarsList] = useState([])
  const [typesList, setTypesList] = useState([])
  const [umsList, setUmsList] = useState([])
  const [init, setInit] = useState({types: false, vars: false, ums: false})

  //State management
  useEffect(() => {

    //Socket listeners callbacks definition
    //on connect
    const vars_on_connect = () => {
      axios.post('http://localhost:3001/api/getAll', {table: "Type", fields:["name", "id"]})
        .then(response => {
          setTypesList(response.data.result.map((val) => ({name:val[0], id:val[1]})))
          setInit((prevState) => ({ ...prevState, types: true}))
        })
      axios.post('http://localhost:3001/api/getAll', {table: "um", fields:['id', 'name', 'metric', 'imperial', 'gain', '"offset"']})
        .then(response => {
          setUmsList(response.data.result.map((val) => ({id:val[0], name:val[1], metric:val[2], imperial:val[3], gain:val[4], offset:val[5]})))
          setInit((prevState) => ({ ...prevState, ums: true}))
          addMessage({children: response.data.message})
        })
      axios.post('http://localhost:3001/api/getAll', {table: "Var", fields:["name", "type", "um", "id"]})
        .then(response => {
          setVarsList(response.data.result.map((val) => ({name:val[0], type:val[1], um:val[2], id:val[3]})))
          setInit((prevState) => ({ ...prevState, vars: true}))
        })
    }

    //on error
    const vars_on_error = (...args) => {
      const error = args[0]
      console.log(error)
    }

    //on update
    const vars_on_update = (...args) => {
      const value = args[0]
      if (value.table === "Type" && value.operation === 'INSERT') {
        var types = typesList
        types.push(value.data)
        setTypesList([...types])
      }
      if (value.table === "um" && value.operation === 'INSERT') {
        var ums = umsList
        ums.push(value.data)
        setUmsList([...ums])
      }
      else if (value.table === "Var" && value.operation === 'INSERT') {
        var vars = varsList
        vars.push(value.data)
        setVarsList([...vars])
      }
      else if (value.table === "Var" && value.operation === 'DELETE') {
        setVarsList([...varsList.filter(i => i.id !== value.data.id)])
      }
      else if (value.table === "Var" && value.operation === 'TRUNCATE') {
        setVarsList([...[]])
      }
      else if (value.table === "Var" && value.operation === 'UPDATE') {
        var updVars = varsList
        var index = updVars.findIndex(i => i.id === value.data.id)
        updVars[index] = value.data
        setVarsList([...updVars])
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
    if(init.ums === false){
      axios.post('http://localhost:3001/api/getAll', {table: "um", fields:['id', 'name', 'metric', 'imperial', 'gain', '"offset"']})
        .then(response => {
          setUmsList(response.data.result.map((val) => ({id:val[0], name:val[1], metric:val[2], imperial:val[3], gain:val[4], offset:val[5]})))
          setInit((prevState) => ({ ...prevState, ums: true}))
          addMessage({children: response.data.message})
        })
    }
    if(init.vars === false){
      axios.post('http://localhost:3001/api/getAll', {table: "Var", fields:["name", "type", "um", "id"]})
        .then(response => {
          setVarsList(response.data.result.map((val) => ({name:val[0], type:val[1], um:val[2], id:val[3]})))
          setInit((prevState) => ({ ...prevState, vars: true}))
          addMessage({children: response.data.message})
        })
    }

    //On (re)connection request the lists
    socket.on("connect", vars_on_connect)

    //Error logging
    socket.on("error", vars_on_error)

    //react on update
    socket.on("update", vars_on_update)

    //dismantling listeners
    return () => {
      socket.off("connect", vars_on_connect)
      socket.off("error", vars_on_error)
      socket.off("update", vars_on_update)
    }
  },[init, varsList, typesList, umsList, socket, addMessage])
  return (
  <>
  <Grid>
    <GridCell colSpan={12} className={gridStyles.item}>
      <VarsList varsList={varsList} typesList={typesList} umsList={umsList}/>
    </GridCell>
  </Grid>
  </>
)}

export default Vars