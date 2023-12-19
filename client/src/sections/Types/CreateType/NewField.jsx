import { useState, useContext } from "react"
import { Button } from '@react-md/button'
import {
  Form,
  TextField,
  FormThemeProvider,
  Select
} from '@react-md/form'
import formStyles from '../../../styles/Form.module.scss'
import { CreateTypeContext } from './CreateTypeContext'


function NewField (props) {
  const {createType, setCreateType} = useContext(CreateTypeContext)
  const [name, setName] = useState("")
  const [type, setType] = useState(0)

  //Input Validation
  const InlineNameValidation = (value) => {
    setName(value)
    let pattern = /[^A-Za-z0-9\-_<> ]/g
    setCreateType((prevState) => ({
      ...prevState, 
      fieldNameNotValid: pattern.test(value) || createType.fields.find(i => i.name === value)
    }))
  }
  const InlineTypeValidation = (value) => {
    setType(Number(value))
    setCreateType((prevState) => ({
      ...prevState, 
      fieldTypeNotValid: value === 0
    }))
  }

  //Form Events
  const handleSubmit = (event) => {
    event.preventDefault()
    //it begins validating the input and then, if both type and name are valid, it proceed with the insert of the field and of the query
    let pattern = /[^A-Za-z0-9\-_<> ]/g
    var fieldNameNotValid = pattern.test(name) || createType.fields.find(i => i.name === name) || name === ""
    var fieldTypeNotValid = type === 0
    setCreateType((prevState) => ({
      ...prevState, 
      fieldNameNotValid: fieldNameNotValid,
      fieldTypeNotValid: fieldTypeNotValid
    }))
    if (!fieldNameNotValid && !fieldTypeNotValid){
      var QRef = Date.now()
      setCreateType((prevState) => ({
        ...prevState, 
        fields: [...createType.fields, { type: type, name: name, QRef: QRef }],
        insertQuery: [...createType.insertQuery, {query: `INSERT into "Field" ("id","name","type","parent_type") VALUES (DEFAULT, '${name}', ${type}, typeId)`, QRef: QRef}]}), handleReset()
      )
    }
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
          onChange={(e) => InlineNameValidation(e.target.value)}
          error={createType.fieldNameNotValid}
        />
        <Select
          id='field-type'
          key='field-type'
          options={createType.typesList.map((item) => ({
            label: item.name,
            value: item.id
          }))}
          value={type.toString()}
          placeholder="Choose..."
          label="Field Type"
          className={formStyles.item}
          onChange={(value) => InlineTypeValidation(value)}
          error={createType.fieldTypeNotValid}
        />
        <div className={formStyles.btn_container}>
          <Button
            type="submit"
            theme="primary"
            themeType="outline"
            className={formStyles.btn}
          >
            Add
          </Button>
        </div>
      </Form>
    </FormThemeProvider>
    </div>
  )}
export default NewField