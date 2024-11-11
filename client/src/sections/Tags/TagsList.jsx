import { useContext, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@react-md/table'
import {ctxData} from "../../Helpers/CtxProvider"
import tableStyles from '../../styles/Table.module.scss'
import axios from 'axios'
import { useAddMessage } from "@react-md/alert"

function TagsList () {
  const ctx = useContext(ctxData)
  const addMessage = useAddMessage()
  
  useEffect(() => {
    axios.post('http://localhost:3001/api/getAll', {table: "Tag", fields:['id', 'name', 'var', 'parent_tag', 'type_field', 'um', 'logic_state', 'comment', 'value']})
    .then(response => {
      ctx.setTags(response.data.result.map((val) => ({id:val[0], name:val[1], var:val[2], parent_tag:val[3], type_field:val[4], um:val[5], logic_state:val[6], comment:val[7], value:val[8]})))
      addMessage({children: response.data.message})
    })
  // eslint-disable-next-line
  }, [])
  return(
    <>
      <Table fullWidth className={tableStyles.table}>
        <TableHeader>
          <TableRow>
            <TableCell hAlign="center">Id</TableCell>
            <TableCell hAlign="left" grow >Name</TableCell>
            <TableCell hAlign="center">Type</TableCell>
            <TableCell hAlign="center">UM</TableCell>
            <TableCell hAlign="center">Logic State</TableCell>
            <TableCell hAlign="left">Comment</TableCell>
            <TableCell hAlign="center">Value</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ctx.vars.length>0 && ctx.types.length>0 && ctx.fields.length>0 && ctx.tags.map((item) => {
            //1 is a placeholder test value, to not have it undefined
            var typeItem =1
            var umItem =1
            var logic_stateItem =1
            if (item.type_field === null) {
              //Head tag, which has no type_field
              var varItem = ctx.vars.find(i => i.id === item.var)
              //console.log(item, varsList, varItem)
              typeItem = ctx.types.find(i => i.id === varItem.type)
              umItem = ctx.ums.find(i => i.id === varItem.um)
              logic_stateItem = ctx.logicStates.find(i => i.id === varItem.logic_state)
            } else {
              var fieldItem = ctx.fields.find(i => i.id === item.type_field)
              //console.log(fieldItem, ctx, item)
              typeItem = ctx.types.find(i => i.id === fieldItem.type)
              umItem = ctx.ums.find(i => i.id === fieldItem.um)
              logic_stateItem = ctx.logicStates.find(i => i.id === fieldItem.logic_state)
            }

              return (
                <TableRow key={item.id}>
                  <TableCell className={tableStyles.cell} hAlign="center">{item.id}</TableCell>
                  <TableCell className={tableStyles.cell} hAlign="left">{item.name}</TableCell>
                  <TableCell className={tableStyles.cell} hAlign="center">{typeItem !== undefined ? typeItem.name : item.type}</TableCell>
                  <TableCell className={tableStyles.cell} hAlign="center">{umItem !== undefined && umItem.name}</TableCell>
                  <TableCell className={tableStyles.cell} hAlign="center">{logic_stateItem !== undefined && logic_stateItem.name}</TableCell>
                  <TableCell className={tableStyles.cell} hAlign="left">{item.comment !== undefined && item.comment !== null && item.comment}</TableCell>
                  <TableCell className={tableStyles.cell} hAlign="center">{item.value !== null && item.value.value}</TableCell>
                <TableCell />
                </TableRow>
              )
            })}
        </TableBody>
      </Table>
    </>
  )}
export default TagsList