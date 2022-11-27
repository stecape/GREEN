import { FC } from "react";
import { Typography } from "react-md";
import cn from 'classnames';
import { Grid, GridCell } from '@react-md/utils';
import VarsList from './VarsList'
import NewVar from './NewVar'
import styles from '../../styles/Grid.module.scss';

const Vars: FC = (props) => (
  <>
  <Grid className={cn(styles.grid, styles.smallGrid)}>
    <GridCell className={cn(styles.item, styles.leftAlignedItem)} colSpan={12} >
      <Typography type="headline-4">Vars</Typography>
    </GridCell>
    <GridCell className={styles.item} colSpan={4}>
      <VarsList socket={props.socket}/>
    </GridCell>
    <GridCell className={styles.item} colSpan={8}>
      <NewVar socket={props.socket}/>
    </GridCell>
  </Grid>
  </>
);

export default Vars