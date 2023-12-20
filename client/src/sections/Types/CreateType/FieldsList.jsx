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
  const [modifyFieldPopup, setModifyFieldPopup] = useState({ visible: false, type: 0, name: '', QRef: undefined })

  const updateField = (data)=>{
    //we retreive the field to update object from the array of the fileds and his index,
    //we create a mirror object so that we can update it with the new information and then we recreate the full fields 
    //array with the new information
    var fieldToUpdateIndex = createType.fields.findIndex(i => i.QRef === modifyFieldPopup.QRef)
    var fieldToUpdate = createType.fields[fieldToUpdateIndex]
    fieldToUpdate.name = data.name
    fieldToUpdate.type = data.type
    var fields = createType.fields
    fields[fieldToUpdateIndex] = fieldToUpdate

    //and then we pass to work on the queries:
    //check if the field has been already modified in this round, to update the query 
    var actualQuery = createType.updateQuery.find(i => i.QRef === modifyFieldPopup.QRef)
    var newQuery
    if (actualQuery === undefined) {
      //Not present in the update list: the field could be in the insert list (new field) or already in DB (pre existing field)
      //Check if is in the insert list
      actualQuery = createType.insertQuery.find(i => i.QRef === modifyFieldPopup.QRef)
      if (actualQuery === undefined) {
        //Not present in the insert list: the field was already in DB. We can insert an entry in the update list
        setCreateType((prevState) => ({
          ...prevState,
          updateQuery: [
            ...createType.updateQuery, 
            {query: `UPDATE "Field" SET name='${data.name}', type=${data.type} WHERE "name" = ${modifyFieldPopup.name} AND "parent_type" = typeId`, QRef: fieldToUpdate.QRef}
          ],
          fields: fields
        }), setModifyFieldPopup((prevState) => ({ ...prevState, visible: false })))
      } else {
        //the field is in the insert list. The field has been inserted this round, so it is possible to update the insert query
        newQuery = createType.insertQuery
        newQuery[newQuery.findIndex(i => i.QRef===fieldToUpdate.QRef)] = {query: `INSERT INTO "Field" (id, name, type, parent_type) VALUES (DEFAULT, '${fieldToUpdate.name}', type=${fieldToUpdate.type}, typeId)`, QRef: fieldToUpdate.QRef} 
        setCreateType((prevState) => ({
          ...prevState,
          insertQuery: newQuery,
          fields: fields
        }), setModifyFieldPopup((prevState) => ({ ...prevState, visible: false }))) 
    }} else {
      //the field is already in the update list. It is a preexisting field (not in the insert list) that has been already modified this round.
      //It is possible to update the update query
      newQuery = createType.updateQuery
      newQuery[newQuery.findIndex(i => i.QRef===fieldToUpdate.QRef)] = {query: `UPDATE "Field" SET name='${fieldToUpdate.name}', type=${fieldToUpdate.type} WHERE "name" = ${modifyFieldPopup.name} AND "parent_type" = typeId`, QRef: fieldToUpdate.QRef}
      setCreateType((prevState) => ({
        ...prevState,
        updateQuery: newQuery,
        fields: fields
      }), setModifyFieldPopup((prevState) => ({ ...prevState, visible: false }))) 
    }
  }

  const deleteField = ()=>{
    //we remove the field from the fields array filtering by !== QRef
    //and then we pass to work on the queries:
    //Check if the field has not been created in this round looking for his QRef in the insertQuery list.
    //If this is the case, it means that we must add the query in the deleteQuery array, to remove it from the DB it is a preexisting field
    //Otherwise we just return the deleteQuery array itself, and filtering the insertQuery array is enough.

    var deleteQuery = createType.insertQuery.find(i => i.QRef !== deletePopup.QRef) === undefined ?
      [ ...createType.deleteQuery, {query: `DELETE FROM "Field" WHERE "name" = ${deletePopup.name} AND "parent_type" = typeId`, QRef: deletePopup.QRef} ] :
      createType.deleteQuery

    setCreateType((prevState) => ({
      ...prevState,
      insertQuery: createType.insertQuery.filter(i => i.QRef !== deletePopup.QRef),
      updateQuery: createType.updateQuery.filter(i => i.QRef !== deletePopup.QRef),
      deleteQuery: deleteQuery,
      fields: createType.fields.filter(i => i.QRef !== deletePopup.QRef)
    }))     
    setDeletePopup((prevState) => ({ ...prevState, visible: false }))
  }

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
                      onClick={()=> setDeletePopup({visible: true, id: item.id, name: item.name, QRef: item.QRef})}
                    >
                      <DeleteSVGIcon />
                    </Button>
                    <Button
                      id="icon-button-4"
                      buttonType="icon"
                      aria-label="Edit"
                      onClick={()=> setModifyFieldPopup({visible: true, type: item.type, name: item.name, QRef: item.QRef})}
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
        delField={() => deleteField()}
        cancelCommand={()=>{
          setDeletePopup((prevState) => ({ ...prevState, visible: false }))
        }}
      />
      <ModifyFieldPopup 
        visible={modifyFieldPopup.visible}
        name={modifyFieldPopup.name}
        type={modifyFieldPopup.type}
        QRef={modifyFieldPopup.QRef}
        typesList={createType.typesList}
        fields={createType.fields}
        updField={(data) => updateField(data)}
        cancelCommand={()=>{
          setModifyFieldPopup((prevState) => ({ ...prevState, visible: false }))
        }}
      />
    </>
  )}
export default FieldsList