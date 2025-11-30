import { createContext } from "react";

export const DateContext = createContext<number>(Date.now());

const { Provider, Consumer } = DateContext;

export { Consumer, Provider };
