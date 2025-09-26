// @ts-strict-ignore
import { createContext } from "react";

const TimezoneContext = createContext<string>(undefined);

const { Consumer: TimezoneConsumer, Provider: TimezoneProvider } = TimezoneContext;

export { TimezoneConsumer, TimezoneProvider };
