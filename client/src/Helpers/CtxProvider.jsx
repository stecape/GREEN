import React, { useReducer, useEffect, useContext, createContext, useMemo } from 'react'
import { useAddMessage } from "@react-md/alert"
import { SocketContext } from './socket'
import axios from 'axios'

export const ctxData = createContext()

export const CtxProvider = ({ children }) => {

  const addMessage = useAddMessage()
  const socket = useContext(SocketContext)
  const initialState = {
    types: [],
    fields: [],
    ums: [],
    logicStates: [],
    vars: [],
    tags: [],
    socketStatus: { connected: false },
    init: false
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_TYPES':
        return { ...state, types: action.payload }
      case 'SET_FIELDS':
        return { ...state, fields: action.payload }
      case 'SET_UMS':
        return { ...state, ums: action.payload }
      case 'SET_LOGIC_STATES':
        return { ...state, logicStates: action.payload }
      case 'SET_VARS':
        return { ...state, vars: action.payload }
      case 'SET_TAGS':
        return { ...state, tags: action.payload }
      case 'SET_SOCKET_STATUS':
        return { ...state, socketStatus: action.payload }
      case 'SET_INIT':
        return { ...state, init: action.payload }
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {

    const on_connect = () => {
      dispatch({ type: 'SET_SOCKET_STATUS', payload: { connected: true } })
      axios.post('http://localhost:3001/api/getAll', { table: "Type", fields: ["name", "id", "base_type", "locked"] })
        .then(response => {
          dispatch({ type: 'SET_TYPES', payload: response.data.result.map((val) => ({ name: val[0], id: val[1], base_type: val[2], locked: val[3] })) })
          addMessage({children: response.data.message})
          axios.post('http://localhost:3001/api/getAll', {table: "Field", fields:['id', 'name', 'type', 'parent_type', 'um', 'logic_state', 'comment']})
            .then(response => {
              dispatch({ type: 'SET_FIELDS', payload: response.data.result.map((val) => ({id:val[0], name:val[1], type:val[2], parent_type:val[3], um:val[4], logic_state:val[5], comment:val[6] })) })
              addMessage({children: response.data.message})
              axios.post('http://localhost:3001/api/getAll', {table: "um", fields:['id', 'name', 'metric', 'imperial', 'gain', '"offset"']})
                .then(response => {
                  dispatch({ type: 'SET_UMS', payload: response.data.result.map((val) => ({id:val[0], name:val[1], metric:val[2], imperial:val[3], gain:val[4], offset:val[5] })) })
                  addMessage({children: response.data.message})
                  axios.post('http://localhost:3001/api/getAll', {table: "LogicState", fields:['id', 'name', 'value']})
                    .then(response => {
                      dispatch({ type: 'SET_LOGIC_STATES', payload: response.data.result.map((val) => ({id:val[0], name:val[1], value:val[2] })) })
                      addMessage({children: response.data.message})
                      axios.post('http://localhost:3001/api/getAll', {table: "Var", fields:['id', 'name', 'type', 'um', 'logic_state', 'comment']})
                        .then(response => {
                          dispatch({ type: 'SET_VARS', payload: response.data.result.map((val) => ({id:val[0], name:val[1], type:val[2], um:val[3], logic_state:val[4], comment:val[5] })) })
                          addMessage({children: response.data.message})
                          axios.post('http://localhost:3001/api/getAll', {table: "Tag", fields:['id', 'name', 'var', 'parent_tag', 'type_field', 'um', 'logic_state', 'comment', 'value']})
                            .then(response => {
                              dispatch({ type: 'SET_TAGS', payload: response.data.result.map((val) => ({id:val[0], name:val[1], var:val[2], parent_tag:val[3], type_field:val[4], um:val[5], logic_state:val[6], comment:val[7], value:val[8] })) })
                              addMessage({children: response.data.message})
                            })
                        })
                    })
                })
            })
        })
        .catch(error => console.log(error))
      dispatch({ type: 'SET_INIT', payload: true})
    }

    const on_error = (...args) => {
      console.log("socket error:", args[0])
      dispatch({ type: 'SET_SOCKET_STATUS', payload: { connected: false } })
    }

    const on_connect_error = (...args) => {
      console.log("socket connect error:", args[0])
      dispatch({ type: 'SET_SOCKET_STATUS', payload: { connected: false } })
    }

    const updater = (type, collection, value) => {
      switch(value.operation){
        case 'INSERT':
          dispatch({ type: type, payload: [...state[collection], value.data] })
          break
        
        case 'DELETE':
          dispatch({ type: type, payload: state[collection].filter(i => i.id !== value.data.id) })
          break

        case 'TRUNCATE':
          dispatch({ type: type, payload: [] })
          break
                        
        case 'UPDATE':
          const updatedTypes = state[collection].map(i => i.id === value.data.id ? value.data : i)
          dispatch({ type: type, payload: updatedTypes })
          break

        default:
          break
      }
    }

    const on_update = (...args) => {
      const value = args[0]

      switch(value.table){
        //Type
        case "Type":
          updater ('SET_TYPES', 'types', value)
          /*switch(value.operation){
            case 'INSERT':
              dispatch({ type: 'SET_TYPES', payload: [...state.types, value.data] })
              break
            
            case 'DELETE':
              dispatch({ type: 'SET_TYPES', payload: state.types.filter(i => i.id !== value.data.id) })
              break

            case 'TRUNCATE':
              dispatch({ type: 'SET_TYPES', payload: [] })
              break
                        
            case 'UPDATE':
              const updatedTypes = state.types.map(i => i.id === value.data.id ? value.data : i)
              dispatch({ type: 'SET_TYPES', payload: updatedTypes })
              break

            default:
              break
          } */
          break

        //Field
        case "Field":
          updater ('SET_FIELDS', 'fields', value)
          /*if (value.operation === 'INSERT') {
            var fieldsList = fields
            fieldsList.push(value.data)
            setFields([...fieldsList])
          }
          else if (value.operation === 'DELETE') {
            setFields([...fields.filter(i => i.id !== value.data.id)])
          }
          else if (value.operation === 'TRUNCATE') {
            setFields([...[]])
          }
          else if (value.operation === 'UPDATE') {
            var updFields = fields
            var indexFields = updFields.findIndex(i => i.id === value.data.id)
            updFields[indexFields] = value.data
            setFields([...updFields])
          } */
          break

        //um
        case "um":
          updater ('SET_UMS', 'ums', value)
          /*if (value.operation === 'INSERT') {
            var umsList = ums
            umsList.push(value.data)
            setUms([...umsList])
          }
          else if (value.operation === 'DELETE') {
            setUms([...ums.filter(i => i.id !== value.data.id)])
          }
          else if (value.operation === 'TRUNCATE') {
            setUms([...[]])
          }
          else if (value.operation === 'UPDATE') {
            var updUms = ums
            var indexUms = updUms.findIndex(i => i.id === value.data.id)
            updUms[indexUms] = value.data
            setUms([...updUms])
          } */
          break

        //LogicState
        case "LogicState":
          updater ('SET_LOGIC_STATES', 'logicStates', value)
          /*if (value.operation === 'INSERT') {
            var logicStatesList = logicStates
            logicStatesList.push(value.data)
            setLogicStates([...logicStatesList])
          }
          else if (value.operation === 'DELETE') {
            setLogicStates([...logicStates.filter(i => i.id !== value.data.id)])
          }
          else if (value.operation === 'TRUNCATE') {
            setLogicStates([...[]])
          }
          else if (value.operation === 'UPDATE') {
            var updLogicStates = logicStates
            var indexLogicStates = updLogicStates.findIndex(i => i.id === value.data.id)
            updLogicStates[indexLogicStates] = value.data
            setLogicStates([...updLogicStates])
          } */
          break

        //Vars    
        case "Vars": 
          updater ('SET_VARS', 'vars', value) 
          /*if (value.operation === 'INSERT') {
            var varsList = vars
            varsList.push(value.data)
            setVars([...varsList])
          }
          else if (value.operation === 'DELETE') {
            setVars([...vars.filter(i => i.id !== value.data.id)])
          }
          else if (value.operation === 'TRUNCATE') {
            setVars([...[]])
          }
          else if (value.operation === 'UPDATE') {
            var updVars = vars
            var indexVars = updVars.findIndex(i => i.id === value.data.id)
            updVars[indexVars] = value.data
            setVars([...updVars])
          } */
          break

        //Tags     
        case "Tags":
          updater ('SET_TAGS', 'tags', value)     
          /*if (value.operation === 'INSERT') {
            var tagsList = tags
            tagsList.push(value.data)
            setTags([...tagsList])
          }
          else if (value.operation === 'DELETE') {
            setTags([...tags.filter(i => i.id !== value.data.id)])
          }
          else if (value.operation === 'TRUNCATE') {
            setTags([...[]])
          }
          else if (value.operation === 'UPDATE') {
            var updTags = tags
            var indexTags = updTags.findIndex(i => i.id === value.data.id)
            updTags[indexTags] = value.data
            setTags([...updTags])
          } */
          break

        //Default case
        default:
          break
      }
    }

    const on_close = (...args) => {
      console.log("socket closed:", args[0])
      dispatch({ type: 'SET_SOCKET_STATUS', payload: { connected: false } })
    }

    //On component load request the lists
    if(state.init === false){
      on_connect()
    }

    //On (re)connection request the lists
    socket.on("connect", on_connect)
    
    //Connect arror logging
    socket.on("connect_error", on_connect_error)

    //Error logging
    socket.on("error", on_error)

    //on update
    socket.on('update', on_update)

    //on close
    socket.on('close', on_close)

    //dismantling listeners
    return () => {
      socket.off("connect", on_connect)
      socket.off("connect_error", on_connect_error)
      socket.off("error", on_error)
      socket.off("update", on_update)
      socket.off('close', on_close)
    }
  }, [addMessage, state, socket])

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch])

  return (
    <ctxData.Provider value={value}>
      {children}
    </ctxData.Provider>
  )

}