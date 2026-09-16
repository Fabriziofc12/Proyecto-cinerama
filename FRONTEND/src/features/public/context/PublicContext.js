import { createContext, useContext } from 'react';
export const PublicContext = createContext(null);
export const usePublic = () => useContext(PublicContext);
