import { useState, useEffect } from "react"
import { AppBar, AppBarTitle, AppBarNav } from '@react-md/app-bar';
import { Grid, GridCell } from '@react-md/utils'
import { Button } from "@react-md/button"
import { Dialog, DialogContent } from "@react-md/dialog"
import { ArrowBackSVGIcon } from '@react-md/material-icons';
import {
  Form,
  TextField,
  FormThemeProvider,
  Select
} from '@react-md/form'
import gridStyles from '../../styles/Grid.module.scss'
import formStyles from '../../styles/Form.module.scss'

function UpsertVarPopup (props) {

  const [modalState, setModalState] = useState({ visible: false, name: '', modalType: props.modalType, type: "1", typesList: props.typesList })
  
  //Form Events
  const handleSubmit = (event) => {
    event.preventDefault()
    props.upsertVar({fields: ["name", "type"], values: [modalState.name, modalState.type]})
    setModalState((prevState) => ({ ...prevState, name: "", type: 0}))
  }
  const handleReset = (event) => {
    event.preventDefault()
    setModalState((prevState) => ({ ...prevState, name: "", type: 0}))
    props.cancelCommand()
  }

  useEffect(() => {
    setModalState((prevState) => ({ ...prevState, name: props.name, type: props.type, visible: props.visible, typesList: props.typesList}))
  },[props.name, props.visible, props.type, props.typesList])
  
  return (
    <Dialog
      id="upsert-var-dialog"
      role="alertdialog"
      type={modalState.modalType}
      visible={modalState.visible}
      onRequestClose={props.cancelCommand}
      aria-labelledby="dialog-title"
    >
    <AppBar id={`appbarT`} theme="primary" key="primary">
      <AppBarNav onClick={handleReset} aria-label="Close">
        <ArrowBackSVGIcon />
      </AppBarNav>
      <AppBarTitle>{props.create ? "Creating Var" : "Modifying " + modalState.name}</AppBarTitle>
    </AppBar>
      <DialogContent>
        <div className={formStyles.container}>
          <Grid>
            <GridCell colSpan={12} className={gridStyles.item}>
              <div className={formStyles.container}>
                <FormThemeProvider theme='outline'>
                  <Form className={formStyles.form} onSubmit={handleSubmit} onReset={handleReset}>
                    <TextField
                    id='name'
                    key='name'
                    type='string'
                    placeholder="Var Name"
                    label="Var Name"
                    className={formStyles.item}
                    value={modalState.name}
                    onChange={(e) => setModalState((prevState) => ({ ...prevState, name: e.target.value}))}
                  />
                  <Select
                    id='type'
                    key='type'
                    type='string'
                    options={modalState.typesList.map((item) => ({
                      label: item.name,
                      value: item.id
                    }))}
                    value={modalState.type.toString()}
                    placeholder="Choose..."
                    label="Var Type"
                    className={formStyles.item}
                    onChange={(value) => setModalState((prevState) => ({ ...prevState, type: value}))}
                  />
                    <div className={formStyles.btn_container}>
                      <Button
                        type="submit"
                        theme="primary"
                        themeType="outline"
                        className={formStyles.btn}
                      >
                        {props.create ? "Create" : "Save"}
                      </Button>
                      <Button
                        type="reset"
                        theme="error"
                        themeType="outline"
                        className={formStyles.btn}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </FormThemeProvider>
              </div>
            </GridCell>
          </Grid>
        </div>
      </DialogContent>      
    </Dialog>
  )
}
export default UpsertVarPopup