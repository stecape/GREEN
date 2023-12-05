import { useState, useEffect, useContext } from "react"
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
import { ModifyTypeContext } from './TypesList'

function ModifyTypePopup (props) {

  const socket = useContext(SocketContext)
  const addMessage = useAddMessage()
  
  const {editType, setEditType} = useContext(ModifyTypeContext)
  const [modalState, setModalState] = useState({ visible: false, modalType: props.modalType })
  const upsertType = (name)=>{
    return new Promise((innerResolve, innerReject) => {
      axios.post('http://localhost:3001/api/add', {table: "Type", fields:["name"], values:[name]})
      .then((res)=>{
        axios.post('http://localhost:3001/api/addMany', {table: "TypeDependencies", fields: ["type","dependent_type"], id: res.data.result[0], values: editType.fields.map(field => {return field.type})})
        .then((value)=>{innerResolve(value)})
        .catch((error)=>{innerReject(error)})
      })
      .catch((error)=>{innerReject(error)})
    })
  }

  const handleReset = () => {
    //axios.post('http://localhost:3001/api/removeAll', {table: "NewTypeTmp"})
    props.cancelCommand()
    setEditType((prevState) => ({...prevState, name: '', fields: []}))
  }

  useEffect(() => {
    setModalState((prevState) => ({ ...prevState, visible: props.visible}))

    //Socket listeners callbacks definition
    //on connect
    //////////////////////////////////////////////////////////////////////////////////////////////////Ha senso sta cosa????????? Bisognerebbe aggiornare tutto....
    const modify_type_on_connect = () => {
      axios.post('http://localhost:3001/api/getAll', {table: "NewTypeTmp", fields:["name", "type", "id"]})
        .then(response => {
          setEditType((prevState) => ({...prevState, fields: response.data.result.map((val) => ({name:val[0], type:val[1], id:val[2]}))}))
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
      var fields
      const value = args[0]
      if (value.table === "NewTypeTmp" && value.operation === 'INSERT') {
        fields = editType.fields
        fields.push(value.data)
        setEditType((prevState) => ({...prevState, fields: fields}))
      }
      else if (value.table === "NewTypeTmp" && value.operation === 'DELETE') {
        setEditType((prevState) => ({...prevState, fields: editType.fields.filter(i => i.id !== value.data.id)}))
      }
      else if (value.table === "NewTypeTmp" && value.operation === 'TRUNCATE') {
        setEditType((prevState) => ({...prevState, fields: []}))
      }
      else if (value.table === "NewTypeTmp" && value.operation === 'UPDATE') {
        fields = editType.fields
        var index = fields.findIndex(i => i.id === value.data.id)
        fields[index] = value.data
        setEditType((prevState) => ({...prevState, fields: fields}))
      }
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
    
  },[props.name, props.visible, props.type, props.typesList, socket, addMessage, setEditType, editType.fields])
  
  return (
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
        <AppBarTitle>{"Modifying " + editType.name}</AppBarTitle>
      </AppBar>
      <DialogContent>
        <div className={formStyles.container}>
          <Grid>
            <GridCell colSpan={12} className={gridStyles.item}>
              <ModifyTypeName
                reset={handleReset}
                upsertType={(name)=> upsertType(name)}
              />
            </GridCell>
            <GridCell colSpan={12} className={gridStyles.item}>
              <NewField />
            </GridCell>
            <GridCell colSpan={12} className={gridStyles.item}>
              <FieldsList />
            </GridCell>
            <GridCell colSpan={12} className={gridStyles.item}>
              <QueryList />
            </GridCell>
          </Grid>
        </div>
      </DialogContent>      
    </Dialog>
  )
}
export default ModifyTypePopup