import React from "react";

export const TimezoneContext = React.createContext<string>(undefined as unknown as string);

const { Consumer: TimezoneConsumer, Provider: TimezoneProvider } = TimezoneContext;

export { TimezoneConsumer, TimezoneProvider };
export default TimezoneContext;
