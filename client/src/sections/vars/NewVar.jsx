import { useState } from "react"
import { Button } from '@react-md/button';
import {
  Form,
  TextField,
  FormThemeProvider,
  Select
} from '@react-md/form';
import axios from 'axios'


function NewVar (props) {
  const [type, setType] = useState({});
  const [name, setName] = useState("");
  
  //Form Events
  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3001/api/addVar', {table: "Var", fields:["name", "type"], values:[name, type]})
  }
  const handleReset = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3001/api/cleanVars', {table: "Var"})
  }

  return(
    <>
    <FormThemeProvider theme='outline'>
      <Form onSubmit={handleSubmit} onReset={handleReset}>
        <TextField
          id='name'
          key='name'
          type='string'
          placeholder="Var Name"
          label="Var Name"
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
          onChange={(type) => setType(type)}
        />
        <Button
          type="submit"
          theme="primary"
          themeType="outline"
        >
          Create
        </Button>
        <Button
          type="reset"
          theme="error"
          themeType="outline"
        >
          Delete All
        </Button>
      </Form>
    </FormThemeProvider>
    </>
  )}
export default NewVar;