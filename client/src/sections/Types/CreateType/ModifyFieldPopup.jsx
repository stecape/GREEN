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

function ModifyFieldPopup (props) {
  const [modalState, setModalState] = useState({ visible: false, name: '', type: 0, fieldNameNotValid: false })

  //Input Validation
  const InlineValidation = (value) => {
    let pattern = /[^A-Za-z0-9\-_<> ]/g
    setModalState((prevState) => ({ ...prevState, name: value, fieldNameNotValid: pattern.test(value) || props.fields.find(i => i.name === value && i.QRef !== props.QRef) || value === ""}))
  }
  
  //Form Events
  const handleSubmit = (event) => {
    event.preventDefault()
    props.updField({name: modalState.name, type: modalState.type})
  }
  const handleReset = (event) => {
    event.preventDefault()
    props.cancelCommand()
  }

  useEffect(() => {
    setModalState((prevState) => ({ ...prevState, name: props.name, type: props.type, visible: props.visible}))
  },[props.name, props.visible, props.type])
  
  return (
    <Dialog
      id="modify-field-dialog"
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
              label="Field Name"
              value={modalState.name}
              onChange={(e) => InlineValidation(e.target.value)}
              error={modalState.fieldNameNotValid}
            />
            <Select
              id='type'
              key='type'
              options={props.typesList.map((item) => ({
                label: item.name,
                value: item.id
              }))}
              value={modalState.type.toString()}
              label="Type"
              onChange={(value) => setModalState((prevState) => ({ ...prevState, type: Number(value)}))}
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
              disabled={modalState.fieldNameNotValid}
            >
              Save
            </Button>
          </DialogFooter>
        </Form>
      </FormThemeProvider>
    </Dialog>
  )
}
export default ModifyFieldPopup