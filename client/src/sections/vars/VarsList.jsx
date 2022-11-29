import { useState, useEffect } from "react";
import { Button } from "@react-md/button";
import DeletePopup from "../../Helpers/DeletePopup"
import ModifyVarPopup from "../../Helpers/ModifyVarPopup"
import { DeleteSVGIcon, EditSVGIcon } from "@react-md/material-icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@react-md/table'
import axios from 'axios'
import tableStyles from '../../styles/Table.module.scss'

function VarsList (props) {

  const [varsList, setVarsList] = useState(props.varsList);
  const [typesList, setTypesList] = useState(props.typesList);
  const [deletePopup, setDeletePopup] = useState({ visible: false, id: 0, name: '' });
  const [modifyVarPopup, setModifyVarPopup] = useState({ visible: false, id: 0, type: 0, name: '' });
  useEffect(() => {
    setVarsList(props.varsList)
    setTypesList(props.typesList)
  }, [props.varsList, props.typesList]);

  return(
    <>
      <Table fullWidth className={tableStyles.table}>
        <TableHeader>
          <TableRow>
            <TableCell hAlign="left" grow >Name</TableCell>
            <TableCell hAlign="center">Type</TableCell>
            <TableCell hAlign="center">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {varsList.map((item) => {
              var typeItem = typesList.find(i => i.id === item.type)
              return (
                <TableRow
                  key={item.id}
                >
                  <TableCell className={tableStyles.cell} hAlign="left">{item.name}</TableCell>
                  <TableCell className={tableStyles.cell}>{typeItem !== undefined ? typeItem.name : item.type}</TableCell>
                  <TableCell className={tableStyles.cell}>
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
                      onClick={()=> setModifyVarPopup({visible: true, id: item.id, type: item.type, name: item.name})}
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
          axios.post('http://localhost:3001/api/removeOne', {table: "Var", id: deletePopup.id})
            .then(setDeletePopup((prevState) => ({ ...prevState, visible: false })))
        }}
        cancelCommand={()=>{
          setDeletePopup((prevState) => ({ ...prevState, visible: false }))
        }}
      />
      <ModifyVarPopup 
        visible={modifyVarPopup.visible}
        name={modifyVarPopup.name}
        type={modifyVarPopup.type}
        typesList={typesList}
        updVar={(data)=>{
          axios.post('http://localhost:3001/api/modify', {table: "Var", id: modifyVarPopup.id, fields: data.fields, values: data.values})
            .then(setModifyVarPopup((prevState) => ({ ...prevState, visible: false })))
        }}
        cancelCommand={()=>{
          setModifyVarPopup((prevState) => ({ ...prevState, visible: false }))
        }}
      />
    </>
  )}
export default VarsList;