import { useState, useEffect, useContext } from "react"
import { ExpansionPanel } from "@react-md/expansion-panel"
import { Grid, GridCell } from '@react-md/utils'
import VarsList from './VarsList'
import NewVar from './NewVar'
import gridStyles from "../../styles/Grid.module.scss"
import axios from 'axios'

import {SocketContext} from "../../Helpers/socket"

function Vars () {
  const socket = useContext(SocketContext)
  const [varsList, setVarsList] = useState([])
  const [typesList, setTypesList] = useState([])
  const [init, setInit] = useState({types: false, vars: false})
  const [expanded, setExpanded] = useState(false);

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
    if(init.vars === false){
      axios.post('http://localhost:3001/api/getAll', {table: "Var", fields:["name", "type", "id"]})
        .then(response => {
          setVarsList(response.data.value.map((val) => ({name:val[0], type:val[1], id:val[2]})))
          setInit((prevState) => ({ ...prevState, vars: true}))
        })
    }

    //On (re)connection request the lists
    socket.on("connect", () => {
      axios.post('http://localhost:3001/api/getAll', {table: "Type", fields:["name", "id"]})
        .then(response => {
          setTypesList(response.data.value.map((val) => ({name:val[0], id:val[1]})))
          setInit((prevState) => ({ ...prevState, types: true}))
        })
      axios.post('http://localhost:3001/api/getAll', {table: "Var", fields:["name", "type", "id"]})
        .then(response => {
          setVarsList(response.data.value.map((val) => ({name:val[0], type:val[1], id:val[2]})))
          setInit((prevState) => ({ ...prevState, vars: true}))
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
    })

    //dismantling listeners
    return () => {
      socket.off("connect")
      socket.off("error")
      socket.off("update")
    }
  },[init, varsList, typesList, socket])
  return (
  <>
  <Grid>
    <GridCell colSpan={12} className={gridStyles.item}>
      <ExpansionPanel
        id="new-var"
        expanded={expanded}
        onExpandClick={() => setExpanded(!expanded)}
        header="Create new var"
      >
        <NewVar typesList={typesList} id={() => {return varsList.length>0 ? varsList[0].id : 0}}/>
      </ExpansionPanel>
    </GridCell>
    <GridCell colSpan={12} className={gridStyles.item}>
      <VarsList typesList={typesList} varsList={varsList}/>
    </GridCell>
  </Grid>
  </>
)}

export default Vars