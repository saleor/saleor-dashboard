// @ts-strict-ignore
import { createContext } from "react";

export const DateContext = createContext<number>(undefined);

const { Provider, Consumer } = DateContext;

export { Consumer, Provider };
