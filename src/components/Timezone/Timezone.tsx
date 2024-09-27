// @ts-strict-ignore
import React from "react";

const TimezoneContext = React.createContext<string>(undefined);

const { Consumer: TimezoneConsumer, Provider: TimezoneProvider } = TimezoneContext;

export { TimezoneConsumer, TimezoneProvider };
