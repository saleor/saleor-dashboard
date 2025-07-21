import React from "react";

export const TimezoneContext = React.createContext<string | undefined>(undefined);

const { Consumer: TimezoneConsumer, Provider: TimezoneProvider } = TimezoneContext;

export { TimezoneConsumer, TimezoneProvider };
export default TimezoneContext;
