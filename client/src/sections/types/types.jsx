import { FC } from "react";
import { Typography } from "react-md";
import cn from 'classnames';
import { Grid, GridCell } from '@react-md/utils';
import TypesList from './TypesList'
import NewType from './NewType'
import grid_styles from '../../styles/Grid.module.scss';

const Types: FC = (props) => (
  <>
  <Grid className={cn(grid_styles.grid, grid_styles.smallGrid)}>
    <GridCell className={cn(grid_styles.item, grid_styles.leftAlignedItem)} colSpan={12} >
      <Typography type="headline-4">Types</Typography>
    </GridCell>
    <GridCell className={grid_styles.item} colSpan={4}>
      <TypesList socket={props.socket}/>
    </GridCell>
    <GridCell className={grid_styles.item} colSpan={8}>
      <NewType socket={props.socket}/>
    </GridCell>
  </Grid>
  </>
);

export default Types