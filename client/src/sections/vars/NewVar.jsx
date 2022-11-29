import { useState } from "react"
import { Button } from '@react-md/button';
import {
  Form,
  TextField,
  FormThemeProvider,
  Select
} from '@react-md/form';
import axios from 'axios'
import formStyles from '../../styles/Form.module.scss'


function NewVar (props) {
  const [type, setType] = useState({});
  const [name, setName] = useState("");
  
  //Form Events
  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3001/api/add', {table: "Var", fields:["name", "type"], values:[name, type]})
  }
  const handleReset = (event) => {
    event.preventDefault();
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
export default NewVar;