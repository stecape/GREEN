import { useContext } from "react"
import { List, ListItem } from "@react-md/list"

import { CreateTypeContext } from './CreateTypeContext'

function QueryList () {
  const {createType} = useContext(CreateTypeContext)

  return (
    <List>
        <ListItem key={`typeNameQuery`} id={`typeNameQuery`}>{createType.typeNameQuery}</ListItem>
        {console.log(createType)}
        {createType.insertQuery.map((q, i) => (
        <ListItem key={`insertQuery_${i}`} id={`insertQuery_${i}`}>
            {q.query}
        </ListItem>
        ))}
        {createType.updateQuery.map((q, i) => (
        <ListItem key={`updateQuery_${i}`} id={`updateQuery_${i}`}>
            {q.query}
        </ListItem>
        ))}
        {createType.deleteQuery.map((q, i) => (
        <ListItem key={`updateQuery_${i}`} id={`updateQuery_${i}`}>
            {q.query}
        </ListItem>
        ))}
    </List>
  )
}
export default QueryList