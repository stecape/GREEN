import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@react-md/table'
import tableStyles from '../../styles/Table.module.scss'

function TagsList (props) {
  const [tagsList, setTagsList] = useState(props.tagsList)
  const [varsList, setVarsList] = useState(props.varsList)
  const [typesList, setTypesList] = useState(props.typesList)
  const [fieldsList, setFieldsList] = useState(props.fieldsList)
  useEffect(() => {
    setTagsList(props.tagsList)
    setVarsList(props.varsList)
    setTypesList(props.typesList)
    setFieldsList(props.fieldsList)
  }, [props.tagsList, props.varsList, props.typesList, props.fieldsList])
  return(
    <>
      <Table fullWidth className={tableStyles.table}>
        <TableHeader>
          <TableRow>
            <TableCell hAlign="center">Id</TableCell>
            <TableCell hAlign="left" grow >Name</TableCell>
            <TableCell hAlign="center">Type</TableCell>
            <TableCell hAlign="center">UM/Status</TableCell>
            <TableCell hAlign="center">Value</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {varsList.length>0 && typesList.length>0 && fieldsList.length>0 && tagsList.map((item) => {
            //1 is a placeholder test value, to not have it undefined
            var typeItem =1
            if (item.type_field === null) {
              //Head tag, which has no type_field
              var varItem = varsList.find(i => i.id === item.var)
              //console.log(item, varsList, varItem)
              typeItem = typesList.find(i => i.id === varItem.type)
            } else {
              //console.log(fieldsList, typesList, item)
              var fieldItem = fieldsList.find(i => i.id === item.type_field)
              typeItem = typesList.find(i => i.id === fieldItem.type)
            }

              return (
                <TableRow key={item.id}>
                  <TableCell className={tableStyles.cell} hAlign="center">{item.id}</TableCell>
                  <TableCell className={tableStyles.cell} hAlign="left">{item.name}</TableCell>
                  <TableCell className={tableStyles.cell}>{typeItem !== undefined ? typeItem.name : item.type}</TableCell>
                  <TableCell className={tableStyles.cell}>{item.um}</TableCell>
                  <TableCell className={tableStyles.cell}>{item.value !== null && item.value.value}</TableCell>
                <TableCell />
                </TableRow>
              )
            })}
        </TableBody>
      </Table>
    </>
  )}
export default TagsList