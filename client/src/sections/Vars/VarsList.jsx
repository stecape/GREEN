import { useState, useContext } from "react"
import { Button } from "@react-md/button"
import DeleteVarPopup from "./DeleteVarPopup"
import UpsertVarPopup from "./UpsertVarPopup"
import { DeleteSVGIcon, EditSVGIcon, AddSVGIcon } from "@react-md/material-icons"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@react-md/table'
import axios from 'axios'
import {ctxData} from "../../Helpers/CtxProvider"
import tableStyles from '../../styles/Table.module.scss'

function VarsList () {
  const ctx = useContext(ctxData)
  const [deletePopup, setDeletePopup] = useState({ visible: false, id: 0, name: '' })
  const [modifyVarPopup, setModifyVarPopup] = useState({ visible: false, id: 0, type: 0, um: 0, logic_state: 0, name: '' })
  const [createVarPopup, setCreateVarPopup] = useState({ visible: false })

  return(
    <>
      <Table fullWidth className={tableStyles.table}>
        <TableHeader>
          <TableRow>
            <TableCell hAlign="left" grow >Name</TableCell>
            <TableCell hAlign="center">Type</TableCell>
            <TableCell hAlign="center">UM</TableCell>
            <TableCell hAlign="center">Logic State</TableCell>
            <TableCell hAlign="center">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ctx.vars.map((item) => {
              var typeItem = ctx.types.find(i => i.id === item.type)
              var umItem = ctx.ums.find(i => i.id === item.um)
              var logic_stateItem = ctx.logicStates.find(i => i.id === item.logic_state)
              return (
                <TableRow
                  key={item.id}
                >
                  <TableCell className={tableStyles.cell} hAlign="left">{item.name}</TableCell>
                  <TableCell className={tableStyles.cell}>{typeItem !== undefined ? typeItem.name : item.type}</TableCell>
                  <TableCell className={tableStyles.cell}>{umItem !== undefined && item.um !== 0 && item.um !== null && umItem.name}</TableCell>
                  <TableCell className={tableStyles.cell}>{logic_stateItem !== undefined && item.logic_state !== 0 && item.logic_state !== null && logic_stateItem.name}</TableCell>
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
                      onClick={()=> setModifyVarPopup({visible: true, id: item.id, type: item.type, um: item.um, logic_state: item.logic_state, name: item.name})}
                    >
                      <EditSVGIcon />
                    </Button>
                </TableCell>
                <TableCell />
                </TableRow>
              )
            })}
        </TableBody>
      </Table>

      <Button floating="bottom-right" onClick={()=> setCreateVarPopup({visible: true})}><AddSVGIcon /></Button>
      
      <DeleteVarPopup 
        visible={deletePopup.visible}
        name={deletePopup.name}
        delVar={()=>{
          axios.post('http://localhost:3001/api/removeVar', {id: deletePopup.id})
            .then(setDeletePopup((prevState) => ({ ...prevState, visible: false })))
        }}
        cancelCommand={()=>{
          setDeletePopup((prevState) => ({ ...prevState, visible: false }))
        }}
      />
      <UpsertVarPopup 
        visible={modifyVarPopup.visible}
        name={modifyVarPopup.name}
        type={modifyVarPopup.type}
        um={modifyVarPopup.um}
        logic_state={modifyVarPopup.logic_state}
        modalType="full-page"
        typesList={ctx.types}
        umsList={ctx.ums}
        logic_stateList={ctx.logicStates}
        upsertVar={(data)=>{
          axios.post('http://localhost:3001/api/modifyVar', {id: modifyVarPopup.id, name: data.name, type: data.type, um: data.um, logic_state: data.logic_state})
            .then(setModifyVarPopup((prevState) => ({ ...prevState, visible: false })))
        }}
        cancelCommand={()=>{
          setModifyVarPopup((prevState) => ({ ...prevState, visible: false }))
        }}
      />
      <UpsertVarPopup 
        visible={createVarPopup.visible}
        create
        name=""
        type={0}
        um={0}
        logic_state={0}
        modalType="full-page"
        typesList={ctx.types}
        umsList={ctx.ums}
        logic_stateList={ctx.logicStates}
        upsertVar={(data)=>{
          axios.post('http://localhost:3001/api/addVar', data)
            .then(setCreateVarPopup((prevState) => ({ ...prevState, visible: false })))
        }}
        cancelCommand={()=>{
          setCreateVarPopup((prevState) => ({ ...prevState, visible: false }))
        }}
      />
    </>
  )}
export default VarsList