import { useState, useContext } from "react"
import { Button } from '@react-md/button'
import {
  Form,
  TextField,
  FormThemeProvider,
  Select
} from '@react-md/form'
import formStyles from '../../../styles/Form.module.scss'
import { ModifyTypeContext } from '../TypesList'


function NewField () {
  const {editType, setEditType} = useContext(ModifyTypeContext)
  const [name, setName] = useState("")
  const [type, setType] = useState(0)

  //Input Validation
  const InlineValidation = (value) => {
    setName(value)
    let pattern = /[^A-Za-z0-9\-_<> ]/g
    setEditType((prevState) => ({
      ...prevState, 
      fieldNameNotValid: pattern.test(value) || editType.fields.find(i => i.name === value)
    }))
  }

  //Form Events
  const handleSubmit = (event) => {
    console.log(name, type, typeof(type))
    event.preventDefault()
    var typeItem = editType.typesList.find(i => i.id === Number(type))
    let pattern = /[^A-Za-z0-9\-_<> ]/g
    var fieldNameNotValid = pattern.test(name) || editType.fields.find(i => i.name === name) || name === ""
    var fieldTypeNotValid = type === "0"
/*     setEditType((prevState) => ({
      ...prevState, 
      fieldNameNotValid: fieldNameNotValid,
      fieldTypeNotValid: fieldTypeNotValid
    }))

    if (!fieldNameNotValid && !fieldTypeNotValid){
      setEditType((prevState) => ({
        ...prevState, 
        fields: [...editType.fields, { id: Math.floor(Date.now() / 1000), type: typeItem.name, name: name }],
        query: [...editType.query, `INSERT into "Field" ("id","name","type","parent_type") VALUES  (DEFAULT, '${name}', ${type}, ${editType.type})`]}), handleReset()
      )
    } */
  }

  //Form Events
  const handleReset = () => {
    setName("")
    setType(0)
  }

  return(
    <div className={formStyles.container}>
    <FormThemeProvider theme='outline'>
      <Form className={formStyles.form} onSubmit={handleSubmit}>
        <TextField
          id='field-name'
          key='field-name'
          type='string'
          label="Field Name"
          className={formStyles.item}
          value={name}
          onChange={(e) => InlineValidation(e.target.value)}
          error={editType.fieldNameNotValid}
        />
        <Select
          id='field-type'
          key='field-type'
          options={editType.typesList.map((item) => ({
            label: item.name,
            value: item.id
          }))}
          value={type.toString()}
          placeholder="Choose..."
          label="Field Type"
          className={formStyles.item}
          onChange={(type) => setType(Number(type))}
          error={editType.fieldNameNotValid}
        />
        <div className={formStyles.btn_container}>
          <Button
            type="submit"
            theme="primary"
            themeType="outline"
            className={formStyles.btn}
            disabled={editType.fieldNameNotValid || editType.fieldTypeNotValid}
          >
            Add
          </Button>
        </div>
      </Form>
    </FormThemeProvider>
    </div>
  )}
export default NewField