import { useState, useEffect } from "react"
import { useAddMessage } from "@react-md/alert"
import { Button } from '@react-md/button'
import {
  FormMessage,
  Form,
  TextField,
  FormThemeProvider,
  Select
} from '@react-md/form'
import axios from 'axios'
import formStyles from '../../../styles/Form.module.scss'


function NewField (props) {
  const addMessage = useAddMessage()
  const [typesList, setTypesList] = useState(props.typesList)
  const [name, setName] = useState("")
  const [type, setType] = useState(0)
  const [valid, setValid] = useState(true)

  useEffect(() => { 
    setTypesList(props.typesList)
  }, [props.typesList])


  //Input Validation
  const InlineValidation = (value) => {
    setName(value)
    let pattern = /[^A-Za-z0-9\-_<> ]/g
    setValid(!pattern.test(value) & value !== "")
  }

  //Form Events
  const handleSubmit = (event) => {
    event.preventDefault()
    axios.post('http://localhost:3001/api/add', {table: "NewTypeTmp", fields:["name", "type", "parent_type"], values:[name, type, 0]})
    .then(()=>{handleReset()})
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
          id='simple-help-and-error-messages-field-name'
          aria-describedby={'simple-help-and-error-messages-field-name-message'}
          key='field-name'
          type='string'
          label="Field Name"
          className={formStyles.item}
          value={name}
          onChange={(e) => InlineValidation(e.target.value)}
          error={!valid}
        />
        <FormMessage id={'simple-help-and-error-messages-field-name-message'} error={!valid}>
          Wrong characters
        </FormMessage>
        <Select
          id='field-type'
          key='field-type'
          options={typesList.map((item) => ({
            label: item.name,
            value: item.id
          }))}
          value={type.toString()}
          placeholder="Choose..."
          label="Field Type"
          className={formStyles.item}
          onChange={(type) => setType(Number(type))}
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