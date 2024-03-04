import { createContext, useContext } from "react";

interface NavigatorContext {
  isNavigatorVisible: boolean;
  setNavigatorVisibility: (visible: boolean) => void;
}

export const NavigatorContext = createContext<null | NavigatorContext>(null);

export const useNavigatorContext = () => {
  const context = useContext(NavigatorContext);

  if (context === null) {
    throw new Error("you are outside of context");
  }

  return context;
};
