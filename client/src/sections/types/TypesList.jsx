import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@react-md/table'
import axios from 'axios'

import styles from './types.scss'


function TypesList (props) {
  const [varsList, setVarsList] = useState({});
  useEffect(() => {
    props.socket.on('connect', () => {
      axios.post('http://localhost:3001/api/getVars', {table: "Var", fields:["name", "type"]})
        .then(response => {
          console.log(response.data.value)
          setVarsList(response.data.value)
        });
    });

    props.socket.io.on("error", (error) => {
      console.log(error)
    });

    props.socket.on("newVar", (value) => {
      var items = varsList
      items.push(value)
      setVarsList(items)
    });

    return () => {
      props.socket.off('connect');
      props.socket.off('disconnect');
    };
  }, [varsList, props.socket]);
  return(
    <>
      <Table className={styles.centered}>
        <TableHeader>
          <TableRow>
            <TableCell>Column 1</TableCell>
            <TableCell>Column 2</TableCell>
            <TableCell>Column 3</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Cell 1-1</TableCell>
            <TableCell>Cell 1-2</TableCell>
            <TableCell>Cell 1-3</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Cell 2-1</TableCell>
            <TableCell>Cell 2-2</TableCell>
            <TableCell>Cell 2-3</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Cell 3-1</TableCell>
            <TableCell>Cell 3-2</TableCell>
            <TableCell>Cell 3-3</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  )}
export default TypesList;