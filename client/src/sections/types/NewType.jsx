import { useState, useEffect } from "react"
import { Divider } from '@react-md/divider';
import {
  Form,
  TextField,
  FormThemeProvider,
  Select
} from '@react-md/form';
import axios from 'axios'

function NewType (props) {
  const [fieldsList, setFieldsList] = useState([]);
  const [field, setField] = useState({});
  useEffect(() => {

  });
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