import React from "react";

import { AppStateContext } from "../containers/AppState";

function useAppState() {
  const stateAndDispatch = React.useContext(AppStateContext);

  return stateAndDispatch;
}

export default useAppState;
