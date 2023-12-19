import React, { createContext, useState, useMemo, useCallback } from "react";

const CreateTypeContext = createContext()

const CreateTypeContextProvider = ({children}) => {
    const [createType, setCreateType] = useState({
        typeNameQuery: '',
        insertQuery:[],
        updateQuery:[],
        deleteQuery:[],
        name: '',
        type: 0,
        fields: [],
        allTypes: [],
        typesList: [],
        typeNameNotValid: false,
        fieldTypeNotValid: false,
        fieldNameNotValid: false
    })

    const initCreateTypeContext = useCallback((typesList, filteredTypesList) => {
      setCreateType({
        typeNameQuery: '',
        insertQuery:[],
        updateQuery:[],
        deleteQuery:[],
        name: '',
        type: 0,
        fields: [],
        allTypes: typesList,
        typesList: filteredTypesList,
        typeNameNotValid: false,
        fieldTypeNotValid: false,
        fieldNameNotValid: false
      })
    },[])

    const value = useMemo(
        () => ({ createType, setCreateType, initCreateTypeContext }),
        [createType, setCreateType, initCreateTypeContext]
      );

    return (
      // the Provider gives access to the context to its children
      <CreateTypeContext.Provider value = {value}>
        {children}
      </CreateTypeContext.Provider>
    );
}

export { CreateTypeContext, CreateTypeContextProvider };