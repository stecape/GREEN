import { useState, useEffect, useRef, useContext, createContext } from "react"
import { useAddMessage } from "@react-md/alert"
import { AppBar, AppBarTitle, AppBarNav } from '@react-md/app-bar'
import { Grid, GridCell } from '@react-md/utils'
import { Dialog, DialogContent } from "@react-md/dialog"
import { ArrowBackSVGIcon } from '@react-md/material-icons'
import FieldsList from './ModifyType/FieldsList'
import NewField from './ModifyType/NewField'
import ModifyTypeName from './ModifyType/ModifyTypeName'
import QueryList from './ModifyType/QueryList'
import gridStyles from '../../styles/Grid.module.scss'
import formStyles from '../../styles/Form.module.scss'
import axios from 'axios'

import {SocketContext} from "../../Helpers/socket"

export const ModifyTypeContext = createContext()

function ModifyTypePopup (props) {

  const socket = useContext(SocketContext)
  const addMessage = useAddMessage()
  
  const [modalState, setModalState] = useState({ visible: false, name: props.name, modalType: props.modalType, type: props.type, typesList: props.typesList })
  const [typeFieldsList, setTypeFieldsList] = useState([])
  const [query, setQuery] = useState([])
  const init = useRef(false)
  const upsertType = (name)=>{
    return new Promise((innerResolve, innerReject) => {
      axios.post('http://localhost:3001/api/add', {table: "Type", fields:["name"], values:[name]})
      .then((res)=>{
        axios.post('http://localhost:3001/api/addMany', {table: "TypeDependencies", fields: ["type","dependent_type"], id: res.data.result[0], values: typeFieldsList.map(field => {return field.type})})
        .then((value)=>{innerResolve(value)})
        .catch((error)=>{innerReject(error)})
      })
      .catch((error)=>{innerReject(error)})
    })
  }

  const handleReset = () => {
    axios.post('http://localhost:3001/api/removeAll', {table: "NewTypeTmp"})
    props.cancelCommand()
    setModalState((prevState) => ({ ...prevState, type: "0"}))
  }

  useEffect(() => {
    setModalState((prevState) => ({ ...prevState, name: props.name, type: props.type, visible: props.visible, typesList: props.typesList}))

    //clear query on exit
    if (props.type !== modalState.type){
      setQuery([])
    }

    //Socket listeners callbacks definition
    //on connect

    const modify_type_on_connect = () => {
      axios.post('http://localhost:3001/api/getAll', {table: "NewTypeTmp", fields:["name", "type", "id"]})
        .then(response => {
          setTypeFieldsList(response.data.result.map((val) => ({name:val[0], type:val[1], id:val[2]})))
        })
        .catch(error => {
          addMessage({
            children: error.response.data.message,
          })
        })
    }

    //on error
    const modify_type_on_error = (...args) => {
      const error = args[0]
      console.log("Error: " + error)
      addMessage({
        children: error.message,
      })
    }

    //on update
    const modify_type_on_update = (...args) => {
      const value = args[0]
      if (value.table === "NewTypeTmp" && value.operation === 'INSERT') {
        var fields = typeFieldsList
        fields.push(value.data)
        setTypeFieldsList([...fields])
      }
      else if (value.table === "NewTypeTmp" && value.operation === 'DELETE') {
        setTypeFieldsList([...typeFieldsList.filter(i => i.id !== value.data.id)])
      }
      else if (value.table === "NewTypeTmp" && value.operation === 'TRUNCATE') {
        setTypeFieldsList([...[]])
      }
      else if (value.table === "NewTypeTmp" && value.operation === 'UPDATE') {
        var updFields = typeFieldsList
        var index = updFields.findIndex(i => i.id === value.data.id)
        updFields[index] = value.data
        setTypeFieldsList([...updFields])
      }
    }

    //On component load request the lists
    if(!init.current){
      init.current = true
      setQuery([])
      axios.post('http://localhost:3001/api/getAll', {table: "NewTypeTmp", fields:["name", "type", "id"]})
        .then(response => {
          setTypeFieldsList(response.data.result.map((val) => ({name:val[0], type:val[1], id:val[2]})))
        })
    }

    //On (re)connection request the lists
    socket.on("connect", modify_type_on_connect)

    //Error logging
    socket.on("error", modify_type_on_error)

    //react on update
    socket.on("update", modify_type_on_update)

    //dismantling listeners
    return () => {
      socket.off("connect", modify_type_on_connect)
      socket.off("error", modify_type_on_error)
      socket.off("update", modify_type_on_update)
    }
    
  },[props.name, props.visible, props.type, props.typesList, init, typeFieldsList, socket, addMessage, modalState.type])
  
  return (
    <ModifyTypeContext.Provider value={{query, setQuery}}>
      <Dialog
        id="modify-type-dialog"
        role="alertdialog"
        type={modalState.modalType}
        visible={modalState.visible}
        onRequestClose={handleReset}
        aria-labelledby="dialog-title"
      >
        <AppBar id={`appbarT`} theme="primary" key="primary">
          <AppBarNav onClick={handleReset} aria-label="Close">
            <ArrowBackSVGIcon />
          </AppBarNav>
          <AppBarTitle>{"Modifying " + modalState.name}</AppBarTitle>
        </AppBar>
        <DialogContent>
          <div className={formStyles.container}>
            <Grid>
              <GridCell colSpan={12} className={gridStyles.item}>
                <ModifyTypeName
                  name={modalState.name}
                  type={modalState.type}
                  typesList={props.typesList}
                  reset={handleReset}
                  upsertType={(name)=> upsertType(name)}
                />
              </GridCell>
              <GridCell colSpan={12} className={gridStyles.item}>
                <NewField typesList={props.typesList} />
              </GridCell>
              <GridCell colSpan={12} className={gridStyles.item}>
                <FieldsList type={props.type} typesList={props.typesList} typeFieldsList={typeFieldsList}/>
              </GridCell>
              <GridCell colSpan={12} className={gridStyles.item}>
                <QueryList />
              </GridCell>
            </Grid>
          </div>
        </DialogContent>      
      </Dialog>
    </ModifyTypeContext.Provider>
  )
}
export default ModifyTypePopup