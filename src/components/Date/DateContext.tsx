import React from "react";

// Casting - we want context to always assume value is set, so littly hacky here, so it's clean in other places
export const DateContext = React.createContext<number | undefined>(undefined);
