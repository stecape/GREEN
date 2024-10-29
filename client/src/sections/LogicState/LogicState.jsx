import { useState, useEffect, useContext } from "react"
import { useAddMessage } from "@react-md/alert"
import { Grid, GridCell } from '@react-md/utils'
import LogicStatesList from './LogicStatesList'
import gridStyles from "../../styles/Grid.module.scss"
import axios from 'axios'

import {SocketContext} from "../../Helpers/socket"

function LogicState () {
  const socket = useContext(SocketContext)
  const addMessage = useAddMessage()
  const [logicStatesList, setLogicStatesList] = useState([])
  const [init, setInit] = useState({logicState: false})

  //State management
  useEffect(() => {

    //Socket listeners callbacks definition
    //on connect
    const logicState_on_connect = () => {
      axios.post('http://localhost:3001/api/getAll', {table: "LogicState", fields:['id', 'name', 'value']})
        .then(response => {
          setLogicStatesList(response.data.result.map((val) => ({id:val[0], name:val[1], value:val[2]})))
          setInit((prevState) => ({ ...prevState, logicState: true}))
        })
    }

    //on error
    const logicState_on_error = (...args) => {
      const error = args[0]
      console.log(error)
    }

    //on update
    const logicState_on_update = (...args) => {
      const value = args[0]
      if (value.table === "LogicState" && value.operation === 'INSERT') {
        var LogicStates = logicStatesList
        LogicStates.push(value.data)
        setLogicStatesList([...LogicStates])
      }
      else if (value.table === "LogicState" && value.operation === 'DELETE') {
        setLogicStatesList([...logicStatesList.filter(i => i.id !== value.data.id)])
      }
      else if (value.table === "LogicState" && value.operation === 'TRUNCATE') {
        setLogicStatesList([...[]])
      }
      else if (value.table === "LogicState" && value.operation === 'UPDATE') {
        var updLogicStates = logicStatesList
        var index = updLogicStates.findIndex(i => i.id === value.data.id)
        updLogicStates[index] = value.data
        setLogicStatesList([...updLogicStates])
      }
    }

    //On component load request the lists
    if(init.logicState === false){
      axios.post('http://localhost:3001/api/getAll', {table: "LogicState", fields:['id', 'name', 'value']})
        .then(response => {
          setLogicStatesList(response.data.result.map((val) => ({id:val[0], name:val[1], value:val[2]})))
          setInit((prevState) => ({ ...prevState, logicState: true}))
          addMessage({children: response.data.message})
        })
    }

    //On (re)connection request the lists
    socket.on("connect", logicState_on_connect)

    //Error logging
    socket.on("error", logicState_on_error)

    //react on update
    socket.on("update", logicState_on_update)

    //dismantling listeners
    return () => {
      socket.off("connect", logicState_on_connect)
      socket.off("error", logicState_on_error)
      socket.off("update", logicState_on_update)
    }
  },[init, logicStatesList, socket, addMessage])
  return (
  <>
  <Grid>
    <GridCell colSpan={12} className={gridStyles.item}>
      <LogicStatesList logicStatesList={logicStatesList}/>
    </GridCell>
  </Grid>
  </>
)}

export default LogicState
