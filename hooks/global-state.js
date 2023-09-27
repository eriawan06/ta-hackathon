import React, { createContext, useState } from 'react'

export function createStateContext(initialValue) {
  const Context = createContext(initialValue)
  const DispatchContext = createContext(() => {})

  const StateProvider = ({ children }) => {
    const [state, dispatch] = useState(initialValue)

    return (
      <Context.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          {children}
        </DispatchContext.Provider>
      </Context.Provider>
    )
  }

  // const useStateContext = () => useContext(Context);
  // const useDispatchContext = () => useContext(DispatchContext);

  return {
    Context,
    DispatchContext,
    StateProvider
    // useStateContext,
    // useDispatchContext,
  }
}
