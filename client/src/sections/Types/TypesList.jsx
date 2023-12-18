import { useState, useEffect, useContext } from "react"
import { useAddMessage } from "@react-md/alert"
import { Button } from "@react-md/button"
import DeleteTypePopup from "./DeleteTypePopup"
import CreateTypePopup from "./CreateTypePopup"
import ModifyTypePopup from "./ModifyTypePopup"
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
import { ModifyTypeContext } from "./ModifyType/ModifyTypeContext";

function TypesList (props) {
  const addMessage = useAddMessage()
  const [typesList, setTypesList] = useState(props.typesList)
  const [deletePopup, setDeletePopup] = useState({ visible: false, id: 0, name: '' })
  const [modifyTypePopup, setModifyTypePopup] = useState({ visible: false })
  const [createTypePopup, setCreateTypePopup] = useState({ visible: false })
  const {setEditType} = useContext(ModifyTypeContext)

  useEffect(() => {
    setTypesList(props.typesList)
  }, [props.typesList, addMessage])

  return(
    <>
      <Table fullWidth className={tableStyles.table}>
        <TableHeader>
          <TableRow>
            <TableCell hAlign="left" grow >Name</TableCell>
            <TableCell hAlign="center">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {typesList.map((item) => {
              return (
                <TableRow
                  key={item.id}
                >
                  <TableCell className={tableStyles.cell} hAlign="left">{item.name}</TableCell>
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
                      onClick={()=> 
                        //the edit button of each type make an async call to the API, which, given the type Id, it retreives:
                        // - the type name
                        // - the type id
                        // - the type's fields list
                        // - the list of the types that includes the type in theyr dependencies
                        //   (we must avoid that one of these types could be included in the type that we are modifying, otherwise we would generate a circular dependency) 
                        //and then it configures the context:
                        //the query list is cleared,
                        //the name of the type to edit is initialized, and so it is the type Id and the relative fields.
                        //The context is populated also with the "all types" array, to allow the "no duplicate name" validation,
                        //and with the types list which is included with the types that are not included in the dependencies array, 
                        //to avoid circular references
                        axios.post('http://localhost:3001/api/getFields', {type: item.id})
                        .then((res) => {
                          setEditType(() => ({
                            query: [],
                            name: res.data.result.name,
                            type: res.data.result.type,
                            fields: res.data.result.fields,
                            allTypes: typesList,
                            typesList: typesList.filter(i => !res.data.result.deps.includes(i.id) )
                          }), setModifyTypePopup((prevState) => ({ ...prevState, visible: true })))  //as callback, tt shows the popup                         
                        })
                      }
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

      <Button 
        floating="bottom-right" 
        onClick={()=>
          axios.post('http://localhost:3001/api/removeAll', {table: "NewTypeTmp"})
          .then(setCreateTypePopup({visible: true}))}
      >
        <AddSVGIcon />
      </Button>

      <DeleteTypePopup 
        visible={deletePopup.visible}
        name={deletePopup.name}
        delType={()=>{
          axios.post('http://localhost:3001/api/removeType', {id: deletePopup.id})
            .then(response => {
              addMessage({children: response.data.message})
            })
            .catch(error => {
              if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                addMessage({children: "Error: " + error.response.data.message, messageId: Date.now().toString()})
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                addMessage({children: "Error: database not reachable"})
                console.log(error.request);
              } else {
                // Something happened in setting up the request that triggered an Error
                addMessage({children: "Error: wrong request parameters"})
                console.log('Error', error.message);
              }
              console.log(error.config);
            })
            .finally(()=>setDeletePopup((prevState) => ({ ...prevState, visible: false })))
        }}
        cancelCommand={()=>{
          setDeletePopup((prevState) => ({ ...prevState, visible: false }))
        }}
      />

      {/*
       * Modify Popup
       * Devo popolare la tabella con i fields,
       * Devo passare i Types,
       * Devo aggiornare il nome del Type
      */}
      
        <ModifyTypePopup
          visible={modifyTypePopup.visible}
          modalType="full-page"
          cancelCommand={()=>{
            setModifyTypePopup((prevState) => ({ ...prevState, visible: false }))
          }}
        />
      <CreateTypePopup
        visible={createTypePopup.visible}
        name=""
        modalType="full-page"
        typesList={typesList}
        cancelCommand={()=>{
          setCreateTypePopup((prevState) => ({ ...prevState, visible: false }))
        }}
      />
    </>
  )}
export default TypesList