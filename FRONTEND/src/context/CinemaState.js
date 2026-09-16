import { createContext, useContext } from 'react';

export const CinemaContext = createContext();
export const useCinema = () => useContext(CinemaContext);
