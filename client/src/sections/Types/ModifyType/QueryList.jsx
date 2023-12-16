import { useContext } from "react"
import { List, ListItem } from "@react-md/list"

import { ModifyTypeContext } from './ModifyTypeContext'

function QueryList () {
  const {editType} = useContext(ModifyTypeContext)

  return (
    <List>
        {editType.query.map((q, i) => (
        <ListItem key={`query_${i}`} id={`query_${i}`}>
            {q}
        </ListItem>
        ))}
    </List>
  )
}
export default QueryList