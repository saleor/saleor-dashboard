import { createContext, Dispatch, SetStateAction, useContext } from "react";

interface DevModeContextShape {
  variables: string;
  setVariables: Dispatch<SetStateAction<string>>;
  isDevModeVisible: boolean;
  setDevModeVisibility: Dispatch<SetStateAction<boolean>>;
  devModeContent: string;
  setDevModeContent: Dispatch<SetStateAction<string>>;
}

export const DevModeContext = createContext<null | DevModeContextShape>(null);

export const useDevModeContext = () => {
  const context = useContext(DevModeContext);

  if (context === null) {
    throw new Error("you are outside of context");
  }

  return context;
};
