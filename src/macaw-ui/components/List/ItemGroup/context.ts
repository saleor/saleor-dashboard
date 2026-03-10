import { createContext, useContext } from "react";

const itemGroupContext = createContext<{ triggerOpen: () => void } | null>(
  null
);

export const useItemGroupContext = () => {
  const value = useContext(itemGroupContext);

  if (value === null) {
    throw new Error("You are outside of context");
  }

  return value;
};

export const Provider = itemGroupContext.Provider;
