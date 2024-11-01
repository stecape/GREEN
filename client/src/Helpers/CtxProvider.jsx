import React, { useState, useEffect, useContext, createContext, useMemo } from 'react'
import { useAddMessage } from "@react-md/alert"
import { SocketContext } from './socket'
import axios from 'axios'

export const ctxData = createContext()

export const CtxProvider = ({ children }) => {

  const addMessage = useAddMessage()
  const socket = useContext(SocketContext)
  const [types, setTypes] = useState([])
  const [ums, setUms] = useState([])
  const [logicStates, setLogicStates] = useState([])
  const [vars, setVars] = useState([])
  const [init, setInit] = useState(false)

  useEffect(() => {

    const on_connect = () => {
      axios.post('http://localhost:3001/api/getAll', {table: "Type", fields:["name", "id", "base_type"]})
        .then(response => {
          setTypes(response.data.result.map((val) => ({name:val[0], id:val[1], base_type:val[2]})))
          addMessage({children: response.data.message})
          axios.post('http://localhost:3001/api/getAll', {table: "um", fields:['id', 'name', 'metric', 'imperial', 'gain', '"offset"']})
            .then(response => {
              setUms(response.data.result.map((val) => ({id:val[0], name:val[1], metric:val[2], imperial:val[3], gain:val[4], offset:val[5]})))
              addMessage({children: response.data.message})
              axios.post('http://localhost:3001/api/getAll', {table: "LogicState", fields:['id', 'name', 'value']})
                .then(response => {
                  setLogicStates(response.data.result.map((val) => ({id:val[0], name:val[1], value:val[2]})))
                  addMessage({children: response.data.message})
                  axios.post('http://localhost:3001/api/getAll', {table: "Var", fields:['id', 'name', 'type', 'um', 'logic_state']})
                    .then(response => {
                      setVars(response.data.result.map((val) => ({id:val[0], name:val[1], type:val[2], um:val[3], logic_state:val[4]})))
                      addMessage({children: response.data.message})
                    })
                })
            })
        })
      setInit(() => (true))
    }

    const on_error = (...args) => {
      console.log(args[0])
    }

    const on_update = (...args) => {
      const value = args[0]

      //Type
      if (value.table === "Type" && value.operation === 'INSERT') {
        var typesList = types
        typesList.push(value.data)
        setTypes([...typesList])
      }
      else if (value.table === "Type" && value.operation === 'DELETE') {
        setTypes([...types.filter(i => i.id !== value.data.id)])
      }
      else if (value.table === "Type" && value.operation === 'TRUNCATE') {
        setTypes([...[]])
      }
      else if (value.table === "Type" && value.operation === 'UPDATE') {
        var updTypes = types
        var indexTypes = updTypes.findIndex(i => i.id === value.data.id)
        updTypes[indexTypes] = value.data
        setTypes([...updTypes])
      }

      //um
      if (value.table === "um" && value.operation === 'INSERT') {
        var umsList = ums
        umsList.push(value.data)
        setUms([...umsList])
      }
      else if (value.table === "um" && value.operation === 'DELETE') {
        setUms([...ums.filter(i => i.id !== value.data.id)])
      }
      else if (value.table === "um" && value.operation === 'TRUNCATE') {
        setUms([...[]])
      }
      else if (value.table === "um" && value.operation === 'UPDATE') {
        var updUms = ums
        var indexUms = updUms.findIndex(i => i.id === value.data.id)
        updUms[indexUms] = value.data
        setUms([...updUms])
      }

      //LogicState
      if (value.table === "LogicState" && value.operation === 'INSERT') {
        var logicStatesList = logicStates
        logicStatesList.push(value.data)
        setLogicStates([...logicStatesList])
      }
      else if (value.table === "LogicState" && value.operation === 'DELETE') {
        setLogicStates([...logicStates.filter(i => i.id !== value.data.id)])
      }
      else if (value.table === "LogicState" && value.operation === 'TRUNCATE') {
        setLogicStates([...[]])
      }
      else if (value.table === "LogicState" && value.operation === 'UPDATE') {
        var updLogicStates = logicStates
        var indexLogicStates = updLogicStates.findIndex(i => i.id === value.data.id)
        updLogicStates[indexLogicStates] = value.data
        setLogicStates([...updLogicStates])
      }

      //Vars      
      if (value.table === "Var" && value.operation === 'INSERT') {
        var varsList = vars
        varsList.push(value.data)
        setVars([...varsList])
      }
      else if (value.table === "Var" && value.operation === 'DELETE') {
        setVars([...vars.filter(i => i.id !== value.data.id)])
      }
      else if (value.table === "Var" && value.operation === 'TRUNCATE') {
        setVars([...[]])
      }
      else if (value.table === "Var" && value.operation === 'UPDATE') {
        var updVars = vars
        var indexVars = updVars.findIndex(i => i.id === value.data.id)
        updVars[indexVars] = value.data
        setVars([...updVars])
      }

    }

    //On component load request the lists
    if(init === false){
      on_connect()
    }

    //On (re)connection request the lists
    socket.on("connect", on_connect)
    
    //Error logging
    socket.on("error", on_error)

    //on update
    socket.on('update', on_update)

    //dismantling listeners
    return () => {
      socket.off("connect", on_connect)
      socket.off("error", on_error)
      socket.off("update", on_update)
    }
  }, [addMessage, init, logicStates, socket, types, ums, vars])

  const value = useMemo(
    () => ({ types, setTypes, ums, setUms, logicStates, setLogicStates, vars, setVars }),
    [types, setTypes, ums, setUms, logicStates, setLogicStates, vars, setVars]
  );

  return (
    <ctxData.Provider value={value}>
      {children}
    </ctxData.Provider>
  )

}