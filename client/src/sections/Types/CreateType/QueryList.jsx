import { useContext } from "react"
import { List, ListItem } from "@react-md/list"

import { CreateTypeContext } from './CreateTypeContext'

function QueryList () {
  const {createType} = useContext(CreateTypeContext)

  return (
    <List>
        <ListItem>{createType.typeNameQuery}</ListItem>
        {createType.query.map((q, i) => (
        <ListItem key={`query_${i}`} id={`query_${i}`}>
            {q}
        </ListItem>
        ))}
    </List>
  )
}
export default QueryList