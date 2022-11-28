import { useState, useEffect } from "react"
import {
  Form,
  TextField,
  FormThemeProvider
} from '@react-md/form';
import axios from 'axios'

function NewType (props) {
  const [fieldsList, setFieldsList] = useState([]);
  //const [field, setField] = useState({});
  useEffect(() => {
    props.socket.on('connect', () => {
      axios.post('http://localhost:3001/api/getVars', {table: "Field", fields:["name", "id"]})
        .then(response => {
          console.log(response.data.value)
          setFieldsList(response.data.value.map((val) => ({name:val[0], id:val[1]})))
        });
    });

    props.socket.io.on("error", (error) => {
      console.log(error)
    });

    props.socket.on("update", (value) => {
      if (value.table === "Field" && value.operation === 'INSERT') {
        var items = fieldsList
        items.push(value.data)
        setFieldsList(items)
      }
    });

    return () => {
      props.socket.off('connect');
      props.socket.off('disconnect');
    };
  }, [fieldsList, props.socket]);
  return(
    <>
    <FormThemeProvider theme='outline'>
      <Form >
        <TextField
          id='type_name'
          key='type_name'
          type='string'
          placeholder="Type Name"
          label="Type Name"
        />
      </Form>
    </FormThemeProvider>
    </>
  )}
export default NewType;