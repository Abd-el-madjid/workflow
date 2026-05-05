import React, { createContext, useContext } from 'react';

export const ChecklistAuthContext = createContext(null);

export function ChecklistAuthProvider({ children }) {
  const contextValue = {};

  return (
    <ChecklistAuthContext.Provider value={contextValue}>
      {children}
    </ChecklistAuthContext.Provider>
  );
}

export function useChecklistAuthContext() {
  const context = useContext(ChecklistAuthContext);
  if (!context) {
    throw new Error('useChecklistAuthContext must be used within ChecklistAuthProvider');
  }
  return context;
}
