import { useContext } from "react"
import { Grid, GridCell } from '@react-md/utils'
import { ctxData } from "../../Helpers/CtxProvider"
import gridStyles from "../../styles/Grid.module.scss"
import { TextContainer } from '@react-md/typography'

const basetypes = {
  Real: 'float',
  Int: 'int',
  Bool: 'bool',
  String: 'String',
  TimeStamp: 'time_t',
}

const IsBaseType = (x, data, types)=> {
  let sentence = {}
  sentence.type = data.find(d => d.id === x).type
  sentence.result = types.find(t => t.id === sentence.type).base_type
  console.log ("sentence: ", sentence)
  return sentence
}

export default function NoPage() {
  const ctx = useContext(ctxData)
  let structs = { types: [], vars: [] }

  //Generazione dei tipi di dati
  //Itera l'array dei tipi andando a cercare quelli complessi, e ritorna un array di oggetti contenenti nome del type e campi.
  //Verrà usato per generare la parte di codice C che va a definire i tipi di dati
  structs.types = ctx.types.filter(t => !t.base_type).map(type => {
    let fields = ctx.fields.filter(field => field.parent_type === type.id).map(f => {
      //Se è un tipo base ritorna la nomenclatura C prendendola dalle definizioni basetypes, se invece è un tipo complesso ritorna il nome del type:
      return { name: f.name, type: basetypes[ctx.types.find(t => t.id === f.type).name] !== undefined ? basetypes[ctx.types.find(t => t.id === f.type).name] : ctx.types.find(t => t.id === f.type).name }
    })
    return { name: type.name, fields: fields }
  })

  //Generazione delle istanze a partire dalla tabella delle Vars
  structs.vars = ctx.vars.map(v => {
    console.log(v)
    return { id: v.id, name: v.name, type: basetypes[ctx.types.find(t => t.id === v.type).name] !== undefined ? basetypes[ctx.types.find(t => t.id === v.type).name] : ctx.types.find(t => t.id === v.type).name }
  })

  return (
    <>
      <Grid>
        <GridCell colSpan={6} className={gridStyles.item}>
          <TextContainer style={{marginLeft: '1em'}}>
            <pre>
              {
                structs.types.map(t => {
                  let str = `
typedef struct {${t.fields.map(f => { return ("\n\t" + f.type + " " + f.name) })}
} ${t.name};\n`
                  return (
                    str
                  )
                })
              }
            </pre>
          </TextContainer>
        </GridCell>
        <GridCell colSpan={6} className={gridStyles.item}>
          <TextContainer style={{marginLeft: '1em'}}>
            <pre>
            {
              structs.init = structs.vars.map(v => {
                //le tag da inizializzare sono quelle la cui var è un tipo base oppure quelle il cui field type un tipo base (tagIsBaseType(t, ctx))
                let initTags = ctx.tags.filter(t => (t.var === v.id && t.type_field !== null && IsBaseType(t.type_field, ctx.fields, ctx.types).result) || (t.var === v.id && IsBaseType(v.id, ctx.vars, ctx.types).result))

                let inits = initTags.map(t => {
                  let type = t.type_field !== null ? IsBaseType(t.type_field, ctx.fields, ctx.types).type : IsBaseType(v.id, ctx.vars, ctx.types).type
                  switch(ctx.types.find(t => t.id === type).name){
                    case 'Real':
                      console.log("Real", t.name + " = 0;")
                      return t.name + " = 0;"
                    case 'Int':
                      console.log("Int", t.name + " = 0;")
                      return t.name + " = 0;"
                    case 'TimeStamp':
                      console.log("TimeStamp", t.name + " = 0;")
                      return t.name + " = 0;"
                    case 'Bool':
                      console.log("Bool", t.name + " = false;")
                      return t.name + " = false;"
                    case 'String':
                      console.log("String", t.name + " = '';")
                      return t.name + " = '';"
                    default:
                      return ""
                  }
                })
                console.log("inits: ", inits)
                return ("\n" + v.type + " " + v.name + ";\n" + inits.map(e => e + "\n").join(""))
              })
            }
            </pre>
          </TextContainer>
        </GridCell>
      </Grid>
    </>
  )
}