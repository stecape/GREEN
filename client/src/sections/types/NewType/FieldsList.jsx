import { useState, useEffect } from "react"
import { Button } from "@react-md/button"
import DeletePopup from "../../../Helpers/DeletePopup"
import ModifyFieldPopup from "../../../Helpers/ModifyVarPopup"
import { DeleteSVGIcon, EditSVGIcon } from "@react-md/material-icons"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@react-md/table'
import axios from 'axios'
import tableStyles from '../../../styles/Table.module.scss'

function FieldsList (props) {

  const [newTypeFieldsList, setNewTypeFieldsList] = useState(props.newTypeFieldsList)
  const [typesList, setTypesList] = useState([])
  const [deletePopup, setDeletePopup] = useState({ visible: false, id: 0, name: '' })
  const [modifyFieldPopup, setModifyFieldPopup] = useState({ visible: false, id: 0, type: 0, name: '' })
  useEffect(() => {          
    setNewTypeFieldsList(props.newTypeFieldsList)
    setTypesList(props.typesList)
  }, [props.newTypeFieldsList, props.typesList])

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
          {newTypeFieldsList.map((item) => {
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
                      onClick={()=> setModifyFieldPopup({visible: true, id: item.id, type: item.type, name: item.name})}
                    >
                      <EditSVGIcon />
                    </Button>
                </TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>

      <DeletePopup 
        visible={deletePopup.visible}
        name={deletePopup.name}
        delVar={()=>{
          axios.post('http://localhost:3001/api/removeOne', {table: "NewTypeTmp", id: deletePopup.id})
            .then(setDeletePopup((prevState) => ({ ...prevState, visible: false })))
        }}
        cancelCommand={()=>{
          setDeletePopup((prevState) => ({ ...prevState, visible: false }))
        }}
      />
      <ModifyFieldPopup 
        visible={modifyFieldPopup.visible}
        name={modifyFieldPopup.name}
        type={modifyFieldPopup.type}
        typesList={typesList}
        updVar={(data)=>{
          axios.post('http://localhost:3001/api/modify', {table: "NewTypeTmp", id: modifyFieldPopup.id, fields: data.fields, values: data.values})
            .then(setModifyFieldPopup((prevState) => ({ ...prevState, visible: false })))
        }}
        cancelCommand={()=>{
          setModifyFieldPopup((prevState) => ({ ...prevState, visible: false }))
        }}
      />
    </>
  )}
export default FieldsList