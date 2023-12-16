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
import tableStyles from '../../../styles/Table.module.scss'
import { ModifyTypeContext } from './ModifyTypeContext'


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
            var typeItem = editType.typesList.find(i => i.id === item.type)
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
                    onClick={() => setDeletePopup({visible: true, id: item.id, name: item.name})}
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
          setEditType((prevState) => ({
              ...prevState,
              query:[
                ...prevState.query,
                `DELETE FROM "Field" WHERE "id" = ${deletePopup.id}`
              ],
              fields: editType.fields.filter(i => i.id !== deletePopup.id)
            }
          ), setDeletePopup((prevState) => ({ ...prevState, visible: false })))
        }}
        cancelCommand={()=>{
          setDeletePopup((prevState) => ({ ...prevState, visible: false }))
        }}
      />
      <ModifyFieldPopup 
        visible={modifyFieldPopup.visible}
        name={modifyFieldPopup.name}
        type={modifyFieldPopup.type}
        id={modifyFieldPopup.id}
        typesList={editType.typesList}
        fields={editType.fields}
        updField={(data)=>{
          var fieldToUpdateIndex = editType.fields.findIndex(i => i.id === data.id)
          var fieldToUpdate = editType.fields[fieldToUpdateIndex]
          fieldToUpdate.name = data.name
          fieldToUpdate.type = data.type
          var fields = editType.fields
          fields[fieldToUpdateIndex] = fieldToUpdate
          setEditType((prevState) => ({
            ...prevState,
            query: [
              ...editType.query,
              `UPDATE "Field" SET name='${fieldToUpdate.name}', type=${fieldToUpdate.type} WHERE id = ${fieldToUpdate.id}`
            ],
            fields: fields
          }), setModifyFieldPopup((prevState) => ({ ...prevState, visible: false })))
        }}
        cancelCommand={()=>{
          setModifyFieldPopup((prevState) => ({ ...prevState, visible: false }))
        }}
      />
    </>
  )}
export default FieldsList