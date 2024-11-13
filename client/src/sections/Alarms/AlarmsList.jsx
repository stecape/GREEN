import { useContext } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@react-md/table'
import {ctxData} from "../../Helpers/CtxProvider"
import tableStyles from '../../styles/Table.module.scss'

function AlarmsList () {
  const ctx = useContext(ctxData)
  let alarmVars = ctx.vars.filter(t => t.type===15)
  let alarms = alarmVars.map(i => {
    let alarmVar = ctx.vars.find(t => t.name === i.name)
    let alarmVarFields = ctx.tags.filter(t => t.var===alarmVar.id)
    let alarm = {}
    alarm.Id = alarmVar.id
    alarm.Name = alarmVar.name
    alarm.Description = alarmVarFields.find(a => a.type_field===18).value !== null ? alarmVarFields.find(a => a.type_field===18).value : ""
    alarm.Status = alarmVarFields.find(a => a.type_field===16).value !== null ? alarmVarFields.find(a => a.type_field===16).value : ""
    alarm.Reaction = alarmVarFields.find(a => a.type_field===17).value !== null ? alarmVarFields.find(a => a.type_field===17).value : ""
    alarm.Ts = alarmVarFields.find(a => a.type_field===18).value !== null ? alarmVarFields.find(a => a.type_field===18).value : ""
    return alarm
  })
  console.log("alarms: ", alarms)
  return(
    <>
      <Table fullWidth className={tableStyles.table}>
        <TableHeader>
          <TableRow>
            <TableCell hAlign="center">Id</TableCell>
            <TableCell hAlign="left">TimeStamp</TableCell>
            <TableCell hAlign="left">Name</TableCell>
            <TableCell hAlign="left" grow>Description</TableCell>
            <TableCell hAlign="center">Reaction</TableCell>
            <TableCell hAlign="center">Status</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alarms.map((alarm) => {
               return (
                <TableRow key={alarm.Id}>
                  <TableCell className={tableStyles.cell} hAlign="center">{alarm.Id}</TableCell>
                  <TableCell className={tableStyles.cell} hAlign="left">{alarm.Ts}</TableCell>
                  <TableCell className={tableStyles.cell} hAlign="left">{alarm.Name}</TableCell>
                  <TableCell className={tableStyles.cell} hAlign="left" grow>{alarm.Description}</TableCell>
                  <TableCell className={tableStyles.cell} hAlign="center">{alarm.Reaction}</TableCell>
                  <TableCell className={tableStyles.cell} hAlign="center">{alarm.Status}</TableCell> 
                </TableRow>
              )
            })}
        </TableBody>
      </Table>
    </>
  )}
export default AlarmsList