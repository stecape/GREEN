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
  const [typesList, setTypesList] = useState([]);
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
      <Table className={styles.centered}>
        <TableHeader>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody hAlign="right">
          {typesList.map((item) => {
            return (
              <TableRow
                key={item.id}
              >
                <TableCell hAlign="left">{item.name}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  )}
export default TypesList;