import { useState, useContext } from "react"
import { Button } from "@react-md/button"
import DeleteFieldPopup from "./DeleteFieldPopup"
import ModifyFieldPopup from "./ModifyFieldPopup"
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
import { ModifyTypeContext } from '../TypesList'


function FieldsList (props) {
  const {editType, setEditType} = useContext(ModifyTypeContext)
  const [deletePopup, setDeletePopup] = useState({ visible: false, id: 0, name: '' })
  const [modifyFieldPopup, setModifyFieldPopup] = useState({ visible: false, id: 0, type: 0, name: '' })

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
          {editType.fields.map((item) => {
            console.log("item: ", item)
            var typeItem = editType.typesList.find(i => i.id === item.type)
            console.log("typeItem: ", typeItem)
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

      <DeleteFieldPopup 
        visible={deletePopup.visible}
        name={deletePopup.name}
        delField={()=>{
          var fieldData = editType.fields.find(i => i.id === deletePopup.id)
          console.log(props.type, editType.fields, fieldData)
          setEditType((prevState) => ({...prevState, query: [
            ...editType.query,
            `DELETE from "Field" WHERE "name" = '${fieldData.name}' AND "parent_type" = ${props.type}`,
            `DELETE from "TypeDependencies" WHERE "id" = '${fieldData.name}' AND "parent_type" = ${props.type}`
          ]}))
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
        typesList={editType.typesList}
        updField={(data)=>{
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