import { createContext, ReactNode, useEffect,useReducer } from "react";
import useRouter from "use-react-router";

import appStateReducer, { AppStateReducerAction } from "./reducer";
import IAppState, { initialAppState } from "./state";

export type AppStateContextType = [IAppState, React.Dispatch<AppStateReducerAction>];
export const AppStateContext = createContext<AppStateContextType>([
  initialAppState,
  () => undefined,
]);

const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const { location } = useRouter();
  const stateAndDispatch = useReducer(appStateReducer, initialAppState);
  const [state, dispatch] = stateAndDispatch;

  useEffect(() => {
    if (state.error) {
      dispatch({
        payload: {
          error: undefined,
        },
        type: "displayError",
      });
    }
  }, [location]);

  return <AppStateContext.Provider value={stateAndDispatch}>{children}</AppStateContext.Provider>;
};

export const { Consumer } = AppStateContext;

export default AppStateProvider;
