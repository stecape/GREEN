import { useState, useEffect } from "react"
import { Divider } from '@react-md/divider';
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

    props.socket.on("newVar", (value) => {
      var items = typesList
      items.push(value)
      setTypesList(items)
    });

    return () => {
      props.socket.off('connect');
      props.socket.off('disconnect');
    };
  }, [typesList, props.socket]);
  return(
    <>
    <FormThemeProvider theme='outline'>
      <Form >
        <TextField
          id='name'
          key='name'
          type='string'
          placeholder="Var Name"
          label="Var Name"
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
      </Form>
    </FormThemeProvider>
    </>
  )}
export default NewVar;