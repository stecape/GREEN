import { FC, useState, useEffect } from "react";
import { Typography } from "react-md";
import cn from 'classnames';
import { Grid, GridCell } from '@react-md/utils';
import VarsList from './VarsList'
import NewVar from './NewVar'
import styles from '../../styles/Grid.module.scss';
import axios from 'axios'

const Vars: FC = (props) => {
  const [varsList, setVarsList] = useState([]);
  const [typesList, setTypesList] = useState([]);

  //State management
  useEffect(() => {
    props.socket.on('connect', () => {
      axios.post('http://localhost:3001/api/getVars', {table: "Type", fields:["name", "id"]})
        .then(response => {
          setTypesList(response.data.value.map((val) => ({name:val[0], id:val[1]})))
        });
      axios.post('http://localhost:3001/api/getVars', {table: "Var", fields:["name", "type", "id"]})
        .then(response => {
          setVarsList(response.data.value.map((val) => ({name:val[0], type:val[1], id:val[2]})))
        });
    });

    props.socket.io.on("error", (error) => {
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
        console.log(index)
        updVars[index] = value.data
        setVarsList([...updVars])
      }
    });

    return () => {
      props.socket.off("update");
    };
  },[props.socket, varsList, typesList]);
  return (
  <>
  <Grid className={cn(styles.grid, styles.smallGrid)}>
    <GridCell className={cn(styles.item, styles.leftAlignedItem)} colSpan={12} >
      <Typography type="headline-4">Vars</Typography>
    </GridCell>
    <GridCell className={styles.item} colSpan={4}>
      <NewVar typesList={typesList} id={() => {return varsList.length>0 ? varsList[0].id : 0}}/>
    </GridCell>
    <GridCell className={styles.item} colSpan={8}>
      <VarsList typesList={typesList} varsList={varsList}/>
    </GridCell>
  </Grid>
  </>
)};

export default Vars