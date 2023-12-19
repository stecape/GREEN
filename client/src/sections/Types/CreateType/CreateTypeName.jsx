import { useState, useContext } from "react"
import { useAddMessage } from "@react-md/alert"
import { Button } from '@react-md/button'
import {
  Form,
  TextField,
  FormThemeProvider
} from '@react-md/form'
import formStyles from '../../../styles/Form.module.scss'
import { CreateTypeContext } from './CreateTypeContext'

function CreateTypeName (props) {
  const addMessage = useAddMessage()
  const {createType, setCreateType} = useContext(CreateTypeContext)
  const [prevName, setPrevName] = useState(createType.name)


  //Input Validation
  const InlineValidation = (value) => {
    let pattern = /[^A-Za-z0-9\-_<> ]/g
    setCreateType((prevState) => ({...prevState, name: value, typeNameNotValid: pattern.test(value) || createType.allTypes.find(i => i.name === value && i.id !== createType.type) || value === ""}))
  }


  //Form Events
  const handleSubmit = (event) => {
    event.preventDefault()
    //si chiama una promise in arrivo dalle props. La funzione deve eseguire la query di creazione, sul then poi bisogna resettare il form
    props.upsertType(createType.name)
      .then((response)=>{  
        addMessage({children: response.data.message})
      })
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
      .finally(handleReset)
  }

  const handleReset = () => {
    props.reset()
  }

  return(
    <div className={formStyles.container}>
    <FormThemeProvider theme='outline'>
      <Form className={formStyles.form} onSubmit={handleSubmit}  onReset={handleReset}>
        <TextField
          id='name'
          key='name'
          type='string'
          label="Type Name"
          className={formStyles.item}
          value={createType.name}
          onChange={(e) => InlineValidation(e.target.value)}
          onBlur={(e) => {
            if (prevName !== createType.name && !createType.typeNameNotValid) {
              setCreateType((prevState) => ({...prevState, typeNameQuery: `INSERT INTO "Type" (name) VALUES ('${createType.name}') RETURNING id INTO typeId;`}))
              setPrevName(createType.name)
            }
          }}
          error={createType.typeNameNotValid}
        />
        <div className={formStyles.btn_container}>
          <Button
            type="submit"
            theme="primary"
            themeType="outline"
            className={formStyles.btn}
            disabled={createType.typeNameNotValid}
          >
            Save Type
          </Button>
          <Button
            type="reset"
            themeType="outline"
            className={formStyles.btn}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </FormThemeProvider>
    </div>
  )}
export default CreateTypeName