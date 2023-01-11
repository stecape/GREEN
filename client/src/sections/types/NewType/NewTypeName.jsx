import { useState } from "react"
import { Button } from '@react-md/button'
import {
  Form,
  TextField,
  FormThemeProvider
} from '@react-md/form'
import axios from 'axios'
import formStyles from '../../../styles/Form.module.scss'


function NewTypeName (props) {
  const [name, setName] = useState('')



  //Form Events
  const handleSubmit = (event) => {
    event.preventDefault()
    //si chiama una promise in arrivo dalle props. La funzione deve eseguire la query di creazione, sul then poi bisogna resettare il form
    props.create(name)
      .then(()=>{  
        axios.post('http://localhost:3001/api/removeAll', {table: "NewTypeTmp"})
        setName('')
        props.reset()
      })
      .catch(err => console.log(err))
    
  }
  const handleReset = (event) => {
    event.preventDefault()
    axios.post('http://localhost:3001/api/removeAll', {table: "NewTypeTmp"})
    setName('')
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
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className={formStyles.btn_container}>
          <Button
            type="submit"
            theme="primary"
            themeType="outline"
            className={formStyles.btn}
          >
            Create Type
          </Button>
          <Button
            type="reset"
            theme="error"
            themeType="outline"
            className={formStyles.btn}
          >
            Reset
          </Button>
        </div>
      </Form>
    </FormThemeProvider>
    </div>
  )}
export default NewTypeName