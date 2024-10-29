import React, { createContext, useState, useMemo, useCallback } from "react";

const UpsertTypeContext = createContext()

const UpsertTypeContextProvider = ({children}) => {
    const [upsertType, setUpsertType] = useState({
        create: true,
        typeNameQuery: '',
        insertQuery:[],
        updateQuery:[],
        deleteQuery:[],
        name: '',
        type: 0,
        fields: [],
        allTypes: [],
        typesList: [],
        umList: [],
        logic_stateList: [],
        typeNameNotValid: false,
        fieldTypeNotValid: false,
        fieldNameNotValid: false
    })

    const initUpsertTypeContext = useCallback((typesList, filteredTypesList, umList, logic_stateList) => {
      setUpsertType({
        create: true,
        typeNameQuery: '',
        insertQuery:[],
        updateQuery:[],
        deleteQuery:[],
        name: '',
        type: 0,
        fields: [],
        allTypes: typesList,
        typesList: filteredTypesList,
        umList: umList,
        logic_stateList: logic_stateList,
        typeNameNotValid: false,
        fieldTypeNotValid: false,
        fieldNameNotValid: false
      })
    },[])

    const value = useMemo(
        () => ({ upsertType, setUpsertType, initUpsertTypeContext }),
        [upsertType, setUpsertType, initUpsertTypeContext]
      );

    return (
      // the Provider gives access to the context to its children
      <UpsertTypeContext.Provider value = {value}>
        {children}
      </UpsertTypeContext.Provider>
    );
}

export { UpsertTypeContext, UpsertTypeContextProvider };