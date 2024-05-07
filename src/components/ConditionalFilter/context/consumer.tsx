import { useContext } from "react";

import { ConditionalFilterContext } from "./context";

export const useConditionalFilterContext = () => {
  const context = useContext(ConditionalFilterContext);

  if (!context) {
    throw new Error("Filter context must be used within ConditionalFilterContext.Provider.");
  }

  return context;
};
