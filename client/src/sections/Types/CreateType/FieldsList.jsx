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
import { CreateTypeContext } from './CreateTypeContext'

function FieldsList (props) {
  const {createType, setCreateType} = useContext(CreateTypeContext)
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
          {createType.fields.map((item) => {
            var typeItem = createType.typesList.find(i => i.id === item.type)
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
                      onClick={()=> setDeletePopup({visible: true, name: item.name})}
                    >
                      <DeleteSVGIcon />
                    </Button>
                    <Button
                      id="icon-button-4"
                      buttonType="icon"
                      aria-label="Edit"
                      onClick={()=> setModifyFieldPopup({visible: true, type: item.type, name: item.name})}
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
          setCreateType((prevState) => ({
              ...prevState,
              query:[
                ...prevState.query,
                `DELETE FROM "Field" WHERE "name" = ${deletePopup.name} AND "parent_type" = typeId`
              ],
              fields: createType.fields.filter(i => i.id !== deletePopup.id)
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
        typesList={createType.typesList}
        updField={(data)=>{
          var fieldToUpdateIndex = createType.fields.findIndex(i => i.id === data.id)
          var fieldToUpdate = createType.fields[fieldToUpdateIndex]
          fieldToUpdate.name = data.name
          fieldToUpdate.type = data.type
          var fields = createType.fields
          fields[fieldToUpdateIndex] = fieldToUpdate
          setCreateType((prevState) => ({
            ...prevState,
            query: [
              ...createType.query,
              `UPDATE "Field" SET name='${fieldToUpdate.name}', type=${fieldToUpdate.type} WHERE "name" = ${modifyFieldPopup.name} AND "parent_type" = typeId`
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