import { FC, useState, useEffect } from "react";
import { Button } from "@react-md/button";
import DeletePopup from "../../Helpers/DeletePopup"
import ModifyPopup from "../../Helpers/ModifyPopup"
import { DeleteSVGIcon, EditSVGIcon } from "@react-md/material-icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@react-md/table'
import axios from 'axios'

import styles from './vars.scss'

const VarsList: FC = (props) => {

  const [varsList, setVarsList] = useState(props.varsList);
  const [typesList, setTypesList] = useState(props.typesList);
  const [deletePopup, setDeletePopup] = useState({ visible: false, id: 0, name: '' });
  const [modifyPopup, setModifyPopup] = useState({ visible: false, id: 0, type: 0, name: '' });
  useEffect(() => {
    setVarsList(props.varsList)
    setTypesList(props.typesList)
  }, [props.varsList, props.typesList]);

  return(
    <>
      <Table className={styles.centered}>
        <TableHeader>
          <TableRow>
            <TableCell hAlign="center">Name</TableCell>
            <TableCell hAlign="center">Type</TableCell>
            <TableCell hAlign="center">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody hAlign="left">
          {varsList.map((item) => {
              return (
                <TableRow
                  key={item.id}
                >
                  <TableCell hAlign="left">{item.name}</TableCell>
                  <TableCell hAlign="left">{props.typesList.find(i => i.id === item.type)!== undefined ? item.type : props.typesList}</TableCell>
                  <TableCell hAlign="left">
                    <Button
                      id="icon-button-4"
                      buttonType="icon"
                      theme="error"
                      aria-label="Permanently Delete"
                      onClick={()=> setDeletePopup({visible: true, id: item.id, name: item.name})}
                    >
                      <DeleteSVGIcon />
                    </Button>
                    <Button
                      id="icon-button-4"
                      buttonType="icon"
                      aria-label="Edit"
                      onClick={()=> setModifyPopup({visible: true, id: item.id, type: item.type, name: item.name})}
                    >
                      <EditSVGIcon />
                    </Button>
                </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>

      <DeletePopup 
        visible={deletePopup.visible}
        name={deletePopup.name}
        delVar={()=>{
          axios.post('http://localhost:3001/api/removeVar', {table: "Var", id: deletePopup.id})
            .then(setDeletePopup((prevState) => ({ ...prevState, visible: false })))
        }}
        cancelCommand={()=>{
          setDeletePopup((prevState) => ({ ...prevState, visible: false }))
        }}
      />
      <ModifyPopup 
        visible={modifyPopup.visible}
        name={modifyPopup.name}
        type={modifyPopup.type}
        typesList={typesList}
        updVar={(data)=>{
          axios.post('http://localhost:3001/api/updateVar', {table: "Var", id: modifyPopup.id, "fields": data.fields, "values": data.values})
            .then(setModifyPopup((prevState) => ({ ...prevState, visible: false })))
        }}
        cancelCommand={()=>{
          setModifyPopup((prevState) => ({ ...prevState, visible: false }))
        }}
      />
    </>
  )}
export default VarsList;