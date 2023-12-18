import React, { createContext, useState, useMemo } from "react";

const CreateTypeContext = createContext()

const CreateTypeContextProvider = ({children}) => {
    const [createType, setCreateType] = useState({
        query:[],
        name: '',
        type: 0,
        fields: [],
        allTypes: [],
        typesList: [],
        typeNameNotValid: false,
        fieldTypeNotValid: false,
        fieldNameNotValid: false
    })

    const value = useMemo(
        () => ({ createType, setCreateType }),
        [createType, setCreateType]
      );

    return (
      // the Provider gives access to the context to its children
      <CreateTypeContext.Provider value = {value}>
        {children}
      </CreateTypeContext.Provider>
    );
}

export { CreateTypeContext, CreateTypeContextProvider };