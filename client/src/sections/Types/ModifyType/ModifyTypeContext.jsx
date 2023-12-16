import React, { createContext, useState, useMemo } from "react";

const ModifyTypeContext = createContext()

const ModifyTypeContextProvider = ({children}) => {
    const [editType, setEditType] = useState({
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
        () => ({ editType, setEditType }),
        [editType, setEditType]
      );

    return (
      // the Provider gives access to the context to its children
      <ModifyTypeContext.Provider value = {value}>
        {children}
      </ModifyTypeContext.Provider>
    );
}

export { ModifyTypeContext, ModifyTypeContextProvider };