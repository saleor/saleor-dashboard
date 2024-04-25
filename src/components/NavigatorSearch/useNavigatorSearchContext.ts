import { createContext, useContext } from "react";

interface NavigatorContext {
  isNavigatorVisible: boolean;
  setNavigatorVisibility: (visible: boolean) => void;
}

export const NavigatorSearchContext = createContext<null | NavigatorContext>(null);

export const useNavigatorSearchContext = () => {
  const context = useContext(NavigatorSearchContext);

  if (context === null) {
    throw new Error("You are using useNavigatorContext outisde of its provider");
  }

  return context;
};
