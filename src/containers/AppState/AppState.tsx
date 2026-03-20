import { type ReactNode } from "react";
import * as React from "react";
import useRouter from "use-react-router";

import appStateReducer, { type AppStateReducerAction } from "./reducer";
import type IAppState from "./state";
import { initialAppState } from "./state";

type AppStateContextType = [IAppState, React.Dispatch<AppStateReducerAction>];
export const AppStateContext = React.createContext<AppStateContextType>([
  initialAppState,
  () => undefined,
]);

const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const { location } = useRouter();
  const stateAndDispatch = React.useReducer(appStateReducer, initialAppState);
  const [state, dispatch] = stateAndDispatch;

  React.useEffect(() => {
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

export default AppStateProvider;
