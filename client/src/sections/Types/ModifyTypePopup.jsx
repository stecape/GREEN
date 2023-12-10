import { useState, useEffect, useContext } from "react"
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
import { ModifyTypeContext } from './TypesList'

function ModifyTypePopup (props) {
  
  const {editType, setEditType} = useContext(ModifyTypeContext)
  const [modalState, setModalState] = useState({ visible: false, modalType: props.modalType })
  const upsertType = ()=> {
    return new Promise((innerResolve, innerReject) => {
      axios.post('http://localhost:3001/api/exec', {query: editType.query.join('; ')})
      .then((value)=>{innerResolve(value)})
      .catch((error)=>{innerReject(error)})
    })
  }

  const handleReset = () => {
    props.cancelCommand()
    setEditType((prevState) => ({...prevState, name: '', fields: []}))
  }

  useEffect(() => {
    setModalState((prevState) => ({ ...prevState, visible: props.visible}))    
  },[props.visible])
  
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