import { useState, useEffect } from "react"
import { Button } from "@react-md/button"
import DeleteTypePopup from "./DeleteTypePopup"
//import ModifyTypePopup from "./ModifyTypePopup"
import { DeleteSVGIcon, EditSVGIcon } from "@react-md/material-icons"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@react-md/table'
import axios from 'axios'
import tableStyles from '../../styles/Table.module.scss'

function TypesList (props) {

  const [typesList, setTypesList] = useState(props.typesList)
  const [deletePopup, setDeletePopup] = useState({ visible: false, id: 0, name: '' })
  //const [modifyTypePopup, setModifyTypePopup] = useState({ visible: false, id: 0, field: 0, name: '' })
  useEffect(() => {
    setTypesList(props.typesList)
  }, [props.typesList])

  return(
    <>
      <Table fullWidth className={tableStyles.table}>
        <TableHeader>
          <TableRow>
            <TableCell hAlign="left" grow >Name</TableCell>
            <TableCell hAlign="center">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {typesList.map((item) => {
              return (
                <TableRow
                  key={item.id}
                >
                  <TableCell className={tableStyles.cell} hAlign="left">{item.name}</TableCell>
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
                      //onClick={()=> setModifyTypePopup({visible: true, id: item.id, field: item.field, name: item.name})}
                    >
                      <EditSVGIcon />
                    </Button>
                </TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>

      <DeleteTypePopup 
        visible={deletePopup.visible}
        name={deletePopup.name}
        delType={()=>{
          axios.post('http://localhost:3001/api/removeType', {id: deletePopup.id})
            .then(setDeletePopup((prevState) => ({ ...prevState, visible: false })))
        }}
        cancelCommand={()=>{
          setDeletePopup((prevState) => ({ ...prevState, visible: false }))
        }}
      />
      
    </>
  )}
export default TypesList


/*<ModifyTypePopup 
        visible={modifyTypePopup.visible}
        name={modifyTypePopup.name}
        field={modifyTypePopup.field}
        fieldsList={fieldsList}
        updType={(data)=>{
          axios.post('http://localhost:3001/api/modify', {table: "Type", id: modifyTypePopup.id, fields: data.fields, values: data.values})
            .then(setModifyTypePopup((prevState) => ({ ...prevState, visible: false })))
        }}
        cancelCommand={()=>{
          setModifyTypePopup((prevState) => ({ ...prevState, visible: false }))
        }}
      />*/