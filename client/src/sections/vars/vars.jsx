import { FC } from "react";
import { Typography } from "react-md";
import cn from 'classnames';
import { Grid, GridCell } from '@react-md/utils';
import VarsList from './VarsList'
import styles from '../../styles/Grid.module.scss';

const Vars: FC = () => (
  <>
  <Grid className={cn(styles.grid, styles.smallGrid)}>
    <GridCell className={cn(styles.item, styles.leftAlignedItem)} colSpan={12} >
      <Typography type="headline-4">Vars</Typography>
    </GridCell>
    <GridCell className={styles.item} colSpan={4}>
      <VarsList />
    </GridCell>
    <GridCell className={styles.item} colSpan={8}>
      Cell 2
    </GridCell>
  </Grid>
  </>
);

export default Vars