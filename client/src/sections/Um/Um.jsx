import { useState, useEffect, useContext } from "react"
import { useAddMessage } from "@react-md/alert"
import { Grid, GridCell } from '@react-md/utils'
import UmList from './UmList'
import gridStyles from "../../styles/Grid.module.scss"
import axios from 'axios'

import {SocketContext} from "../../Helpers/socket"

function Um () {
  const socket = useContext(SocketContext)
  const addMessage = useAddMessage()
  const [umsList, setUmsList] = useState([])
  const [init, setInit] = useState({um: false})

  //State management
  useEffect(() => {

    //Socket listeners callbacks definition
    //on connect
    const um_on_connect = () => {
      axios.post('http://localhost:3001/api/getAll', {table: "um", fields:['id', 'name', 'metric', 'imperial', 'gain', '"offset"']})
        .then(response => {
          setUmsList(response.data.result.map((val) => ({id:val[0], name:val[1], metric:val[2], imperial:val[3], gain:val[4], offset:val[5]})))
          setInit((prevState) => ({ ...prevState, um: true}))
        })
    }

    //on error
    const um_on_error = (...args) => {
      const error = args[0]
      console.log(error)
    }

    //on update
    const um_on_update = (...args) => {
      const value = args[0]
      if (value.table === "um" && value.operation === 'INSERT') {
        var ums = umsList
        ums.push(value.data)
        setUmsList([...ums])
      }
      else if (value.table === "um" && value.operation === 'DELETE') {
        setUmsList([...umsList.filter(i => i.id !== value.data.id)])
      }
      else if (value.table === "um" && value.operation === 'TRUNCATE') {
        setUmsList([...[]])
      }
      else if (value.table === "um" && value.operation === 'UPDATE') {
        var updUms = umsList
        var index = updUms.findIndex(i => i.id === value.data.id)
        updUms[index] = value.data
        setUmsList([...updUms])
      }
    }

    //On component load request the lists
    if(init.um === false){
      axios.post('http://localhost:3001/api/getAll', {table: "um", fields:['id', 'name', 'metric', 'imperial', 'gain', '"offset"']})
        .then(response => {
          setUmsList(response.data.result.map((val) => ({id:val[0], name:val[1], metric:val[2], imperial:val[3], gain:val[4], offset:val[5]})))
          setInit((prevState) => ({ ...prevState, um: true}))
          addMessage({children: response.data.message})
        })
    }

    //On (re)connection request the lists
    socket.on("connect", um_on_connect)

    //Error logging
    socket.on("error", um_on_error)

    //react on update
    socket.on("update", um_on_update)

    //dismantling listeners
    return () => {
      socket.off("connect", um_on_connect)
      socket.off("error", um_on_error)
      socket.off("update", um_on_update)
    }
  },[init, umsList, socket, addMessage])
  return (
  <>
  <Grid>
    <GridCell colSpan={12} className={gridStyles.item}>
      <UmList umsList={umsList}/>
    </GridCell>
  </Grid>
  </>
)}

export default Um
