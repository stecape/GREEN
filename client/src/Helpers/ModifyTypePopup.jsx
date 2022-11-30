import { useState, useEffect } from "react"
import { Button } from "@react-md/button"
import { Dialog, DialogContent, DialogFooter } from "@react-md/dialog"
import { Typography } from "@react-md/typography"
import {
  Form,
  TextField,
  FormThemeProvider,
  Select
} from '@react-md/form'

function ModifyTypePopup (props) {

  const [modalState, setModalState] = useState({ visible: false, name: '', type: "1", typesList: props.typesList })
  
  //Form Events
  const handleSubmit = (event) => {
    event.preventDefault()
    props.updType({fields: ["name", "type"], values: [modalState.name, modalState.type]})
  }
  const handleReset = (event) => {
    event.preventDefault()
    props.cancelCommand()
  }

  useEffect(() => {
    setModalState((prevState) => ({ ...prevState, name: props.name, type: props.type, visible: props.visible, typesList: props.typesList}))
  },[props.name, props.visible, props.type, props.typesList])
  
  return (
    <Dialog
      id="draft-dialog"
      role="alertdialog"
      modal={modalState.modal}
      visible={modalState.visible}
      onRequestClose={props.cancelCommand}
      aria-labelledby="dialog-title"
    >
      <FormThemeProvider theme='outline'>
        <Form onSubmit={handleSubmit} onReset={handleReset}>
          <DialogContent>
            <Typography
              id="dialog-title"
              type="subtitle-1"
              margin="none"
              color="secondary"
            >
              Modifying {modalState.name}:
            </Typography>
            <TextField
              id='name'
              key='name'
              type='string'
              placeholder="Type Name"
              label="Type Name"
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
              label="Type"
              onChange={(value) => setModalState((prevState) => ({ ...prevState, type: value}))}
            />
          </DialogContent>
          <DialogFooter>
            <Button
              type="reset"
              id="dialog-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              id="dialog-modify"
              theme="primary"
            >
              Save
            </Button>
          </DialogFooter>
        </Form>
      </FormThemeProvider>
    </Dialog>
  )
}
export default ModifyTypePopup