import { useState, useEffect, useContext } from "react"
import { useAddMessage } from "@react-md/alert"
import { Grid, GridCell } from '@react-md/utils'
import TypesList from './TypesList'
import gridStyles from "../../styles/Grid.module.scss"
import axios from 'axios'
import { UpsertTypeContextProvider } from "./UpsertType/UpsertTypeContext"
import {SocketContext} from "../../Helpers/socket"

function Types () {
  const socket = useContext(SocketContext)
  const addMessage = useAddMessage()
  const [typesList, setTypesList] = useState([])
  const [init, setInit] = useState({types: false, um: false, logic_state: false, fields: false})

  //State management
  useEffect(() => {

    //Socket listeners callbacks definition
    //on connect
    const types_on_connect = () => {
      axios.post('http://localhost:3001/api/getAll', {table: "Type", fields:["name", "id", "base_type"]})
        .then(response => {
          setTypesList(response.data.result.map((val) => ({name:val[0], id:val[1], base_type:val[2]})))
          setInit((prevState) => ({ ...prevState, types: true}))
        })
    }

    //on error
    const types_on_error = (...args) => {
      const error = args[0]
      console.log(error)
    }

    //on update
    const types_on_update = (...args) => {
      const value = args[0]
      if (value.table === "Type" && value.operation === 'INSERT') {
        var types = typesList
        types.push(value.data)
        setTypesList([...types])
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
    }

    //On component load request the lists
    if(init.types === false){
      axios.post('http://localhost:3001/api/getAll', {table: "Type", fields:["name", "id", "base_type"]})
        .then(response => {
          setTypesList(response.data.result.map((val) => ({name:val[0], id:val[1], base_type:val[2]})))
          setInit((prevState) => ({ ...prevState, types: true}))
          addMessage({children: response.data.message})
        })
    }

    //On (re)connection request the lists
    socket.on("connect", types_on_connect)

    //Error logging
    socket.on("error", types_on_error)

    //react on update
    socket.on("update", types_on_update)

    //dismantling listeners
    return () => {
      socket.off("connect", types_on_connect)
      socket.off("error", types_on_error)
      socket.off("update", types_on_update)
    }
  },[init, typesList, socket, addMessage])
  return (
  <>
  <Grid>
    <GridCell colSpan={12} className={gridStyles.item}>
      <UpsertTypeContextProvider>
        <TypesList typesList={typesList}/>
      </UpsertTypeContextProvider>
    </GridCell>
  </Grid>
  </>
)}

export default Types