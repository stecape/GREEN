import { useState, useEffect } from "react"
import { Button } from "@react-md/button"
import DeleteUmPopup from "./DeleteUmPopup"
import UpsertUmPopup from "./UpsertUmPopup"
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

function UmList (props) {

  const [umsList, setUmsList] = useState(props.umsList)
  const [deletePopup, setDeletePopup] = useState({ visible: false, id: 0, name: '' })
  const [modifyUmPopup, setModifyUmPopup] = useState({ visible: false, id: 0, name: '' })
  const [createUmPopup, setCreateUmPopup] = useState({ visible: false })
  useEffect(() => {
    setUmsList(props.umsList)
  }, [props.umsList])

  return(
    <>
      <Table fullWidth className={tableStyles.table}>
        <TableHeader>
          <TableRow>
            <TableCell hAlign="left" grow >Name</TableCell>
            <TableCell hAlign="center">Metric</TableCell>
            <TableCell hAlign="center">Imperial</TableCell>
            <TableCell hAlign="center">Gain</TableCell>
            <TableCell hAlign="center">Offset</TableCell>
            <TableCell hAlign="center">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {umsList.map((item) => {
              return (
                <TableRow
                  key={item.id}
                >
                  <TableCell className={tableStyles.cell} hAlign="left">{item.name}</TableCell>
                  <TableCell className={tableStyles.cell}>{item.metric}</TableCell>
                  <TableCell className={tableStyles.cell}>{item.imperial}</TableCell>
                  <TableCell className={tableStyles.cell}>{item.gain}</TableCell>
                  <TableCell className={tableStyles.cell}>{item.offset}</TableCell>
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
                      onClick={()=> setModifyUmPopup({visible: true, id: item.id, name: item.name})}
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

      <Button floating="bottom-right" onClick={()=> setCreateUmPopup({visible: true})}><AddSVGIcon /></Button>
      
      <DeleteUmPopup 
        visible={deletePopup.visible}
        name={deletePopup.name}
        delUm={()=>{
          axios.post('http://localhost:3001/api/removeVar', {id: deletePopup.id})
            .then(setDeletePopup((prevState) => ({ ...prevState, visible: false })))
        }}
        cancelCommand={()=>{
          setDeletePopup((prevState) => ({ ...prevState, visible: false }))
        }}
      />
      <UpsertUmPopup 
        visible={modifyUmPopup.visible}
        name={modifyUmPopup.name}
        type={modifyUmPopup.type}
        modalType="full-page"
        upsertUm={(data)=>{
          axios.post('http://localhost:3001/api/modifyVar', {id: modifyUmPopup.id, name: data.name})
            .then(setModifyUmPopup((prevState) => ({ ...prevState, visible: false })))
        }}
        cancelCommand={()=>{
          setModifyUmPopup((prevState) => ({ ...prevState, visible: false }))
        }}
      />
      <UpsertUmPopup 
        visible={createUmPopup.visible}
        create
        name=""
        modalType="full-page"
        upsertUm={(data)=>{
          axios.post('http://localhost:3001/api/addVar', data)
            .then(setCreateUmPopup((prevState) => ({ ...prevState, visible: false })))
        }}
        cancelCommand={()=>{
          setCreateUmPopup((prevState) => ({ ...prevState, visible: false }))
        }}
      />
    </>
  )}
export default UmList