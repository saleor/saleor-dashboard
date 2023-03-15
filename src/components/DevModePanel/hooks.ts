import { createContext, useContext } from "react";

export const DevModeContext = createContext({
  variables: "",
  setVariables: (_value: string) => undefined,
  isDevModeVisible: false,
  setDevModeVisibility: (_value: boolean) => undefined,
  devModeContent: "",
  setDevModeContent: (_value: string) => undefined,
});

export const useDevModeContext = () => {
  const context = useContext(DevModeContext);

  if (context === null) {
    throw new Error("you are outside of context");
  }

  return context;
};
