import { useState } from "react"
import { Button } from '@react-md/button'
import {
  Form,
  TextField,
  FormThemeProvider
} from '@react-md/form'
import axios from 'axios'
import formStyles from '../../styles/Form.module.scss'


function NewType (props) {
  const [type, setType] = useState("")
  const [field, setField] = useState([])
  
  //Form Events
  const handleSubmit = (event) => {
    event.preventDefault()
    axios.post('http://localhost:3001/api/add', {table: "Type", fields:["type", "field"], values:[type, field]})
  }
  const handleReset = (event) => {
    event.preventDefault()
    axios.post('http://localhost:3001/api/removeAll', {table: "Field"})
  }

  return(
    <div className={formStyles.container}>
    <FormThemeProvider theme='outline'>
      <Form className={formStyles.form} onSubmit={handleSubmit} onReset={handleReset}>
        <TextField
          id='name'
          key='name'
          type='string'
          label="Type Name"
          className={formStyles.item}
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <div className={formStyles.btn_container}>
          <Button
            type="submit"
            theme="primary"
            themeType="outline"
            className={formStyles.btn}
          >
            Create
          </Button>
          <Button
            type="reset"
            theme="error"
            themeType="outline"
            className={formStyles.btn}
          >
            Delete All
          </Button>
        </div>
      </Form>
    </FormThemeProvider>
    </div>
  )}
export default NewType