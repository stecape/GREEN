import { Grid, GridCell } from '@react-md/utils'
import VarsList from './VarsList'
import gridStyles from "../../styles/Grid.module.scss"
import {CtxProvider} from "../../Helpers/CtxProvider"

function Vars() {
  return (
    <>
      <Grid>
        <GridCell colSpan={12} className={gridStyles.item}>
          <CtxProvider>
            <VarsList />
          </CtxProvider>
        </GridCell>
      </Grid>
    </>
  )
}

export default Vars