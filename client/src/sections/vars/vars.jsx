import { useState, useEffect } from "react";
import { Grid, GridCell } from '@react-md/utils';
import VarsList from './VarsList'
import NewVar from './NewVar'
import gridStyles from "../../styles/Grid.module.scss";
import axios from 'axios'

function Vars (props) {
  const [varsList, setVarsList] = useState([]);
  const [typesList, setTypesList] = useState([]);

  //State management
  useEffect(() => {
    props.socket.on('connect', () => {
      axios.post('http://localhost:3001/api/getAll', {table: "Type", fields:["name", "id"]})
        .then(response => {
          setTypesList(response.data.value.map((val) => ({name:val[0], id:val[1]})))
        });
      axios.post('http://localhost:3001/api/getAll', {table: "Var", fields:["name", "type", "id"]})
        .then(response => {
          setVarsList(response.data.value.map((val) => ({name:val[0], type:val[1], id:val[2]})))
        });
    });

    props.socket.on("error", (error) => {
      console.log(error)
    });

    props.socket.on("update", (value) => {
      if (value.table === "Type" && value.operation === 'INSERT') {
        var types = typesList
        types.push(value.data)
        setTypesList([...types])
      }
      else if (value.table === "Var" && value.operation === 'INSERT') {
        var vars = varsList
        vars.push(value.data)
        setVarsList([...vars])
      }
      else if (value.table === "Var" && value.operation === 'DELETE') {
        setVarsList([...varsList.filter(i => i.id !== value.data.id)])
      }
      else if (value.table === "Var" && value.operation === 'TRUNCATE') {
        setVarsList([...[]])
      }
      else if (value.table === "Var" && value.operation === 'UPDATE') {
        var updVars = varsList
        var index = updVars.findIndex(i => i.id === value.data.id)
        updVars[index] = value.data
        setVarsList([...updVars])
      }
    });

    return () => {
      props.socket.off("connect");
      props.socket.off("error");
      props.socket.off("update");
    };
  },[props.socket, varsList, typesList]);
  return (
  <>
  <Grid>
    <GridCell colSpan={12} className={gridStyles.item}>
      <NewVar typesList={typesList} id={() => {return varsList.length>0 ? varsList[0].id : 0}}/>
    </GridCell>
    <GridCell colSpan={12} className={gridStyles.item}>
      <VarsList typesList={typesList} varsList={varsList}/>
    </GridCell>
  </Grid>
  </>
)};

export default Vars