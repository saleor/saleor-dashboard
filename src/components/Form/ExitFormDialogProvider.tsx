// @ts-strict-ignore
import { createContext, useEffect, useRef } from "react";

import ExitFormDialog from "./ExitFormDialog";
import { type ExitFormDialogData } from "./types";
import useBeforeUnload from "./useBeforeUnload";
import { useExitFormDialogProvider } from "./useExitFormDialogProvider";

// Do not use this context directly in components
// use useExitFormDialog hook instead
export const ExitFormDialogContext = createContext<ExitFormDialogData>({
  setIsDirty: () => undefined,
  setEnableExitDialog: () => undefined,
  setExitDialogSubmitRef: () => undefined,
  shouldBlockNavigation: () => false,
  showDialog: false,
  setIsSubmitting: () => undefined,
  leave: () => undefined,
  setIsSubmitDisabled: () => undefined,
  resetFormsState: () => undefined,
  unregisterForm: () => undefined,
});

const ExitFormDialogProvider = ({ children }) => {
  const { handleClose, handleLeave, providerData, showDialog, shouldBlockNav } =
    useExitFormDialogProvider();
  const shouldBlockNavRef = useRef(shouldBlockNav);

  useEffect(function syncShouldBlockNavRef() {
    shouldBlockNavRef.current = shouldBlockNav;
  });

  useBeforeUnload(e => {
    // Only for real document unload (refresh, tab close). In-app navigation is
    // handled by history.block and should show the dashboard modal instead.
    if (shouldBlockNavRef.current()) {
      e.preventDefault();
      e.returnValue = "";
    }
  });

  return (
    <ExitFormDialogContext.Provider value={providerData}>
      <ExitFormDialog isOpen={showDialog} onLeave={handleLeave} onClose={handleClose} />
      {children}
    </ExitFormDialogContext.Provider>
  );
};

export default ExitFormDialogProvider;
