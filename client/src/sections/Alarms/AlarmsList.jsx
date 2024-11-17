import { useContext } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableContainer
} from '@react-md/table'
import {ctxData} from "../../Helpers/CtxProvider"
import tableStyles from '../../styles/Table.module.scss'

const TYPE_ID_ALARM = 15
const FIELD_ID_STATUS = 16
const FIELD_ID_REACTION = 17
const FIELD_ID_TS = 18

function AlarmsList () {
  const ctx = useContext(ctxData)
  let alarmVars = ctx.vars.filter(t => t.type===TYPE_ID_ALARM)
  let alarms = alarmVars.map(i => {
    let alarmVar = ctx.vars.find(t => t.name === i.name)
    let alarmVarFields = ctx.tags.filter(t => t.var===alarmVar.id)
    let alarm = {}
    alarm.Name = alarmVar.name
    alarm.Description = alarmVar.comment
    alarm.Status = alarmVarFields.find(a => a.type_field===FIELD_ID_STATUS)?.value !== undefined ? alarmVarFields.find(a => a.type_field===FIELD_ID_STATUS).value : ""
    alarm.Reaction = alarmVarFields.find(a => a.type_field===FIELD_ID_REACTION)?.value !== undefined ? alarmVarFields.find(a => a.type_field===FIELD_ID_REACTION).value : ""
    alarm.Ts = alarmVarFields.find(a => a.type_field===FIELD_ID_TS)?.value !== undefined ? alarmVarFields.find(a => a.type_field===FIELD_ID_TS).value : ""
    return alarm
  })
  let alarmFields = ctx.fields.filter(t => t.type===TYPE_ID_ALARM)
  let alarmTags = alarmFields.flatMap(i => ctx.tags.filter(t => i.id === t.type_field))
  alarmTags.forEach(a => {
    let alarmTagFields = ctx.tags.filter(t => t.parent_tag===a.id)
    let alarm = {}
    alarm.Name = a.name
    alarm.Description = a.comment
    alarm.Status = alarmTagFields.find(a => a.type_field===FIELD_ID_STATUS)?.value !== undefined ? alarmTagFields.find(a => a.type_field===FIELD_ID_STATUS).value : ""
    alarm.Reaction = alarmTagFields.find(a => a.type_field===FIELD_ID_REACTION)?.value !== undefined ? alarmTagFields.find(a => a.type_field===FIELD_ID_REACTION).value : ""
    alarm.Ts = alarmTagFields.find(a => a.type_field===FIELD_ID_TS)?.value !== undefined ? alarmTagFields.find(a => a.type_field===FIELD_ID_TS).value : ""
    alarms.push(alarm)
  })
  return(
    <TableContainer>
      <Table fullWidth>
        <TableHeader>
          <TableRow>
            <TableCell hAlign="left">TimeStamp</TableCell>
            <TableCell hAlign="left" style={{ minWidth: '200px' }}>Name</TableCell>
            <TableCell hAlign="left" grow>Description</TableCell>
            <TableCell hAlign="center">Reaction</TableCell>
            <TableCell hAlign="center">Status</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alarms.map((alarm) => {
                return (
                <TableRow key={alarm.Name}>
                  <TableCell className={tableStyles.cell} hAlign="left">{alarm.Ts}</TableCell>
                  <TableCell className={tableStyles.cell} hAlign="left">{alarm.Name}</TableCell>
                  <TableCell className={tableStyles.cell} hAlign="left">{alarm.Description}</TableCell>
                  <TableCell className={tableStyles.cell} hAlign="center">{alarm.Reaction}</TableCell>
                  <TableCell className={tableStyles.cell} hAlign="center">{alarm.Status}</TableCell> 
                </TableRow>
              )
            })}
        </TableBody>
      </Table>
    </TableContainer>
  )}
export default AlarmsList