import { useContext } from "react"
import { List, ListItem } from "@react-md/list"

import { ModifyTypeContext } from '../ModifyTypePopup'

function QueryList () {
  const {query} = useContext(ModifyTypeContext)

  return (
    <List>
        {query.map((q, i) => (
        <ListItem key={`query_${i}`} id={`query_${i}`}>
            {q}
        </ListItem>
        ))}
    </List>
  )
}
export default QueryList