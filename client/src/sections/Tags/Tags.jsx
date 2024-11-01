import { Grid, GridCell } from '@react-md/utils'
import TagsList from './TagsList'
import gridStyles from "../../styles/Grid.module.scss"
import {CtxProvider} from "../../Helpers/CtxProvider"

function Tags () {
  return (
  <>
  <Grid>
    <GridCell colSpan={12} className={gridStyles.item}>
      <CtxProvider>
        <TagsList />
      </CtxProvider>
    </GridCell>
  </Grid>
  </>
)}

export default Tags