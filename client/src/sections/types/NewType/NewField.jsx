import { useState, useEffect } from "react"
import { Button } from '@react-md/button'
import {
  Form,
  TextField,
  FormThemeProvider,
  Select
} from '@react-md/form'
import axios from 'axios'
import formStyles from '../../../styles/Form.module.scss'


function NewField (props) {
  const [typesList, setTypesList] = useState(props.typesList)
  const [name, setName] = useState(props.fieldName)
  const [type, setType] = useState(props.fieldType)

  useEffect(() => { 
    setTypesList(props.typesList)
    setName(props.fieldName)
    setType(props.fieldType)
  }, [props.typesList, props.fieldName, props.fieldType])


  //Form Events
  const handleSubmit = (event) => {
    event.preventDefault()
    axios.post('http://localhost:3001/api/add', {table: "NewTypeTmp", fields:["name", "type"], values:[name, type]}).then((value)=>console.log(value.data)).catch((error)=>console.log(error))
  }

  return(
    <div className={formStyles.container}>
    <FormThemeProvider theme='outline'>
      <Form className={formStyles.form} onSubmit={handleSubmit}>
        <TextField
          id='name'
          key='name'
          type='string'
          label="Field Name"
          className={formStyles.item}
          value={name}
          onChange={(e) => props.setFieldName(e.target.value)}
        />
        <Select
          id='type'
          key='type'
          type='string'
          options={typesList.map((item) => ({
            label: item.name,
            value: item.id
          }))}
          value={type.toString()}
          placeholder="Choose..."
          label="Field Type"
          className={formStyles.item}
          onChange={(type) => props.setFieldType(type)}
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