import { useState, useEffect } from "react"
import { Divider } from '@react-md/divider';
import { Button } from '@react-md/button';
import {
  Form,
  TextField,
  FormThemeProvider,
  Select
} from '@react-md/form';
import axios from 'axios'


function NewVar (props) {
  const [typesList, setTypesList] = useState([]);
  const [type, setType] = useState({});
  const [name, setName] = useState("");
  
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(name, type)
    axios.post('http://localhost:3001/api/addVar', {table: "Var", fields:["name", "type"], values:[name, type]})
        .then(response => {
          console.log(response.data.value)
        });
  }

  useEffect(() => {
    props.socket.on('connect', () => {
      axios.post('http://localhost:3001/api/getVars', {table: "Type", fields:["name", "id"]})
        .then(response => {
          console.log(response.data.value)
          setTypesList(response.data.value.map((val) => ({name:val[0], id:val[1]})))
        });
    });

    props.socket.io.on("error", (error) => {
      console.log(error)
    });

    props.socket.on("update", (value) => {
      if (value.table === "Type" && value.operation === 'INSERT') {
        var items = typesList
        items.push(value.data)
        setTypesList(items)
      }
    });

    return () => {
      props.socket.off('connect');
      props.socket.off('disconnect');
    };
  }, [typesList, props.socket]);
  return(
    <>
    <FormThemeProvider theme='outline'>
      <Form onSubmit={handleSubmit}>
        <TextField
          id='name'
          key='name'
          type='string'
          placeholder="Var Name"
          label="Var Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Divider />
        <Select
          id='type'
          key='type'
          type='string'
          options={typesList.map((item) => ({
            label: item.name,
            value: item.id
          }))}
          value={type}
          placeholder="Choose..."
          label="Var Type"
          onChange={(type) => setType(type)}
        />
        <Button
          type="submit"
          theme="primary"
          themeType="outline"
        >
          Submit
        </Button>
      </Form>
    </FormThemeProvider>
    </>
  )}
export default NewVar;