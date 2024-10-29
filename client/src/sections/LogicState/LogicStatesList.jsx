import { useState, useEffect } from "react"
import { Button } from "@react-md/button"
import DeleteLogicStatePopup from "./DeleteLogicStatePopup"
import UpsertLogicStatePopup from "./UpsertLogicStatePopup"
import { DeleteSVGIcon, EditSVGIcon, AddSVGIcon } from "@react-md/material-icons"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@react-md/table'
import axios from 'axios'
import tableStyles from '../../styles/Table.module.scss'

function LogicStatesList (props) {

  const [logicStatesList, setLogicStatesList] = useState(props.logicStatesList)
  const [deletePopup, setDeletePopup] = useState({ visible: false, id: 0, name: '' })
  const [modifyLogicStatePopup, setModifyLogicStatePopup] = useState({ visible: false, id: 0, name: '', value: []})
  const [createLogicStatePopup, setCreateLogicStatePopup] = useState({ visible: false })
  useEffect(() => {
    setLogicStatesList(props.logicStatesList)
  }, [props.logicStatesList])

  return(
    <>
      <Table fullWidth className={tableStyles.table}>
        <TableHeader>
          <TableRow>
            <TableCell hAlign="left" grow >Name</TableCell>
            <TableCell hAlign="center">Value</TableCell>
            <TableCell hAlign="center">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logicStatesList.map((item) => {
              return (
                <TableRow
                  key={item.id}
                >
                  <TableCell className={tableStyles.cell} hAlign="left">{item.name}</TableCell>
                  <TableCell className={tableStyles.cell}>{item.value.map(i => i!=="" && `'${i}' `)}</TableCell>
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
                      onClick={()=> setModifyLogicStatePopup({visible: true, id: item.id, name: item.name, value: item.value})}
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

      <Button floating="bottom-right" onClick={()=> setCreateLogicStatePopup({visible: true})}><AddSVGIcon /></Button>
      
      <DeleteLogicStatePopup 
        visible={deletePopup.visible}
        name={deletePopup.name}
        delLogicState={()=>{
          axios.post('http://localhost:3001/api/removeLogicState', {id: deletePopup.id})
            .then(setDeletePopup((prevState) => ({ ...prevState, visible: false })))
        }}
        cancelCommand={()=>{
          setDeletePopup((prevState) => ({ ...prevState, visible: false }))
        }}
      />
      <UpsertLogicStatePopup 
        visible={modifyLogicStatePopup.visible}
        name={modifyLogicStatePopup.name}
        value={modifyLogicStatePopup.value}
        modalType="full-page"
        upsertLogicState={(data)=>{
          axios.post('http://localhost:3001/api/modifyLogicState', {...data, id: modifyLogicStatePopup.id})
            .then(setModifyLogicStatePopup((prevState) => ({ ...prevState, visible: false, value: Array(8).fill("")  })))
        }}
        cancelCommand={()=>{
          setModifyLogicStatePopup((prevState) => ({ ...prevState, visible: false, value: Array(8).fill("")  }))
        }}
      />
      <UpsertLogicStatePopup 
        visible={createLogicStatePopup.visible}
        create
        name=""
        value={Array(8).fill("")}
        modalType="full-page"
        upsertLogicState={(data)=>{
          axios.post('http://localhost:3001/api/addLogicState', data)
            .then(setCreateLogicStatePopup((prevState) => ({ ...prevState, visible: false, value: Array(8).fill("") })))
        }}
        cancelCommand={()=>{
          setCreateLogicStatePopup((prevState) => ({ ...prevState, visible: false }))
        }}
      />
    </>
  )}
export default LogicStatesList