import React from "react";

interface AppAction {
  anchor: React.RefObject<HTMLDivElement>;
  docked: boolean;
  setDocked: (docked: boolean) => void;
}
const AppActionContext = React.createContext<AppAction>({
  anchor: undefined,
  docked: true,
  setDocked: () => undefined
});
export const useAppAction = () => React.useContext(AppActionContext);

export default AppActionContext;
