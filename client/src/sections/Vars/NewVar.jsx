import { useState } from "react"
import { useAddMessage } from "@react-md/alert"
import { Button } from '@react-md/button'
import {
  Form,
  TextField,
  FormThemeProvider,
  Select
} from '@react-md/form'
import axios from 'axios'
import formStyles from '../../styles/Form.module.scss'


function NewVar (props) {
  const addMessage = useAddMessage()
  const [type, setType] = useState({})
  const [name, setName] = useState("")
  
  //Form Events
  const handleSubmit = (event) => {
    event.preventDefault()
    axios.post('http://localhost:3001/api/add', {table: "Var", fields:["name", "type"], values:[name, type]})
    .then(response => addMessage({children: response.data.message}))
    .catch(error => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        addMessage({children: "Error: " + error.response.data.message, messageId: Date.now().toString()})
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        addMessage({children: "Error: database not reachable"})
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        addMessage({children: "Error: wrong request parameters"})
        console.log('Error', error.message);
      }
      console.log(error.config);
    })
  }
  const handleReset = (event) => {
    event.preventDefault()
    axios.post('http://localhost:3001/api/removeAll', {table: "Var"})
  }

  return(
    <div className={formStyles.container}>
    <FormThemeProvider theme='outline'>
      <Form className={formStyles.form} onSubmit={handleSubmit} onReset={handleReset}>
        <TextField
          id='name'
          key='name'
          type='string'
          label="Var Name"
          className={formStyles.item}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Select
          id='type'
          key='type'
          type='string'
          options={props.typesList.map((item) => ({
            label: item.name,
            value: item.id
          }))}
          value={type.toString()}
          placeholder="Choose..."
          label="Var Type"
          className={formStyles.item}
          onChange={(type) => setType(type)}
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
export default NewVar