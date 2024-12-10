import { useContext } from "react";

import { AppStateContext } from "../containers/AppState";

function useAppState() {
  const stateAndDispatch = useContext(AppStateContext);

  return stateAndDispatch;
}

export default useAppState;
