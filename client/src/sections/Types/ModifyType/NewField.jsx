import { useState, useContext } from "react"
import { Button } from '@react-md/button'
import {
  Form,
  TextField,
  FormThemeProvider,
  Select
} from '@react-md/form'
import formStyles from '../../../styles/Form.module.scss'
import { ModifyTypeContext } from '../TypesList'


function NewField () {
  const {editType, setEditType} = useContext(ModifyTypeContext)
  const [name, setName] = useState("")
  const [type, setType] = useState(0)

  //Form Events
  const handleSubmit = (event) => {
    event.preventDefault()
    var typeItem = editType.typesList.find(i => i.id === Number(type))
    setEditType((prevState) => ({
      ...prevState,
      fields: [...editType.fields, { id: Math.floor(Date.now() / 1000), type: typeItem.name, name: name }],
      query: [...editType.query, `INSERT into "Field" ("id","name","type","parent_type") VALUES  (DEFAULT, '${name}', ${type}, ${editType.type})`]}), handleReset()
    )    
  }


  //Form Events
  const handleReset = () => {
    setName("")
    setType(0)
  }

  return(
    <div className={formStyles.container}>
    <FormThemeProvider theme='outline'>
      <Form className={formStyles.form} onSubmit={handleSubmit}>
        <TextField
          id='field-name'
          key='field-name'
          type='string'
          label="Field Name"
          className={formStyles.item}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Select
          id='field-type'
          key='field-type'
          options={editType.typesList.map((item) => ({
            label: item.name,
            value: item.id
          }))}
          value={type.toString()}
          placeholder="Choose..."
          label="Field Type"
          className={formStyles.item}
          onChange={(type) => setType(Number(type))}
        />
        <div className={formStyles.btn_container}>
          <Button
            type="submit"
            theme="primary"
            themeType="outline"
            className={formStyles.btn}
          >
            Add
          </Button>
        </div>
      </Form>
    </FormThemeProvider>
    </div>
  )}
export default NewField