import { createContext } from "react";

const TimezoneContext = createContext<string | undefined>(undefined);

const { Consumer: TimezoneConsumer, Provider: TimezoneProvider } = TimezoneContext;

export { TimezoneConsumer, TimezoneProvider };
