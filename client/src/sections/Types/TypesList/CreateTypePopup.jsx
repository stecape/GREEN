import { useState, useEffect, useContext, useRef } from "react"
import { useAddMessage } from "@react-md/alert"
import { AppBar, AppBarTitle, AppBarNav } from '@react-md/app-bar'
import { Grid, GridCell } from '@react-md/utils'
import { Dialog, DialogContent } from "@react-md/dialog"
import { ArrowBackSVGIcon } from '@react-md/material-icons'
import FieldsList from '../NewType/FieldsList'
import NewField from '../NewType/NewField'
import NewTypeName from '../NewType/NewTypeName'
import gridStyles from '../../../styles/Grid.module.scss'
import formStyles from '../../../styles/Form.module.scss'
import axios from 'axios'

import {SocketContext} from "../../../Helpers/socket"

function CreateTypePopup (props) {

  const [modalState, setModalState] = useState({ visible: false, name: '', modalType: props.modalType, type: "0", typesList: props.typesList })
  
  const socket = useContext(SocketContext)
  const addMessage = useAddMessage()
  const [newTypeFieldsList, setNewTypeFieldsList] = useState([])
  const init = useRef(false)

  const handleReset = () => {
    axios.post('http://localhost:3001/api/removeAll', {table: "NewTypeTmp"})
    props.cancelCommand()
  }

  useEffect(() => {
    setModalState((prevState) => ({ ...prevState, name: props.name, type: props.type, visible: props.visible, typesList: props.typesList}))

    //Socket listeners callbacks definition
    //on connect

    const new_type_on_connect = () => {
      axios.post('http://localhost:3001/api/getAll', {table: "NewTypeTmp", fields:["name", "type", "id"]})
        .then(response => {
          setNewTypeFieldsList(response.data.result.map((val) => ({name:val[0], type:val[1], id:val[2]})))
        })
        .catch(error => {
          addMessage({
            children: error.response.data.message,
          })
        })
    }

    //on error
    const new_type_on_error = (...args) => {
      const error = args[0]
      console.log("Error: " + error)
      addMessage({
        children: error.message,
      })
    }

    //on update
    const new_type_on_update = (...args) => {
      const value = args[0]
      if (value.table === "NewTypeTmp" && value.operation === 'INSERT') {
        var fields = newTypeFieldsList
        fields.push(value.data)
        setNewTypeFieldsList([...fields])
      }
      else if (value.table === "NewTypeTmp" && value.operation === 'DELETE') {
        setNewTypeFieldsList([...newTypeFieldsList.filter(i => i.id !== value.data.id)])
      }
      else if (value.table === "NewTypeTmp" && value.operation === 'TRUNCATE') {
        setNewTypeFieldsList([...[]])
      }
      else if (value.table === "NewTypeTmp" && value.operation === 'UPDATE') {
        var updFields = newTypeFieldsList
        var index = updFields.findIndex(i => i.id === value.data.id)
        updFields[index] = value.data
        setNewTypeFieldsList([...updFields])
      }
      console.log(args)
    }

    //On component load request the lists
    if(!init.current){
      init.current = true
      axios.post('http://localhost:3001/api/getAll', {table: "NewTypeTmp", fields:["name", "type", "id"]})
        .then(response => {
          setNewTypeFieldsList(response.data.result.map((val) => ({name:val[0], type:val[1], id:val[2]})))
        })
    }

    //On (re)connection request the lists
    socket.on("connect", new_type_on_connect)

    //Error logging
    socket.on("error", new_type_on_error)

    //react on update
    socket.on("update", new_type_on_update)

    //dismantling listeners
    return () => {
      socket.off("connect", new_type_on_connect)
      socket.off("error", new_type_on_error)
      socket.off("update", new_type_on_update)
    }
    
  },[props.name, props.visible, props.type, props.typesList, init, newTypeFieldsList, socket, addMessage])
  
  return (
    <Dialog
      id="draft-dialog"
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
      <AppBarTitle>{props.create ? "Creating Type" + modalState.name : "Modifying " + modalState.name}</AppBarTitle>
    </AppBar>
      <DialogContent>
        <div className={formStyles.container}>
          <Grid>
            <GridCell colSpan={12} className={gridStyles.item}>
              <NewTypeName 
                typesList={props.typesList}
                reset={handleReset}
                upsertType={(name)=>{
                  return new Promise((innerResolve, innerReject) => {
                    axios.post('http://localhost:3001/api/add', {table: "Type", fields:["name"], values:[name]})
                    .then((res)=>{
                      axios.post('http://localhost:3001/api/addFields', {table: "Field", fields: ["parent_type","name","type"], id: res.data.result[0], values: newTypeFieldsList.map(field => {return [field.name, field.type]})})
                      axios.post('http://localhost:3001/api/addMany', {table: "TypeDependencies", fields: ["type","dependent_type"], id: res.data.result[0], values: newTypeFieldsList.map(field => {return field.type})})
                      .then((value)=>{innerResolve(value)})
                      .catch((error)=>{innerReject(error)})
                    })
                    .catch((error)=>{innerReject(error)})
                  })
                }}
              />
            </GridCell>
            <GridCell colSpan={12} className={gridStyles.item}>
              <NewField typesList={props.typesList} />
            </GridCell>
            <GridCell colSpan={12} className={gridStyles.item}>
              <FieldsList typesList={props.typesList} newTypeFieldsList={newTypeFieldsList}/>
            </GridCell>
          </Grid>
        </div>
      </DialogContent>      
    </Dialog>
  )
}
export default CreateTypePopup