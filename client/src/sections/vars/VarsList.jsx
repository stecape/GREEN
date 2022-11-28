import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@react-md/table'
import axios from 'axios'

import styles from './vars.scss'


function VarsList (props) {
  const [varsList, setVarsList] = useState([]);
  useEffect(() => {
    props.socket.on('connect', () => {
      axios.post('http://localhost:3001/api/getVars', {table: "Var", fields:["name", "type", "id"]})
        .then(response => {
          console.log(response.data.value)
          setVarsList(response.data.value.map((val) => ({name:val[0], type:val[1], id:val[2]})))
        });
    });

    props.socket.io.on("error", (error) => {
      console.log(error)
    });

    props.socket.on("update", (value) => {
      if (value.table === "Var" && value.operation === 'INSERT') {
        var items = varsList
        items.push(value.data)
        setVarsList(items)
      }
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
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody hAlign="right">
          {varsList.map((item) => {
              return (
                <TableRow
                  key={item.id}
                >
                  <TableCell hAlign="left">{item.name}</TableCell>
                  <TableCell hAlign="left">{item.type}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </>
  )}
export default VarsList;