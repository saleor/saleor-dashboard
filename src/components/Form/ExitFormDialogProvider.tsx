// @ts-strict-ignore
import { createContext } from "react";

import ExitFormDialog from "./ExitFormDialog";
import { ExitFormDialogData } from "./types";
import useBeforeUnload from "./useBeforeUnload";
import { useExitFormDialogProvider } from "./useExitFormDialogProvider";

// Do not use this context directly in components
// use useExitFormDialog hook instead
export const ExitFormDialogContext = createContext<ExitFormDialogData>({
  setIsDirty: () => undefined,
  setEnableExitDialog: () => undefined,
  setExitDialogSubmitRef: () => undefined,
  shouldBlockNavigation: () => false,
  setIsSubmitting: () => undefined,
  leave: () => undefined,
  setIsSubmitDisabled: () => undefined,
});

const ExitFormDialogProvider = ({ children }) => {
  const { handleClose, handleLeave, providerData, showDialog, shouldBlockNav } =
    useExitFormDialogProvider();

  useBeforeUnload(e => {
    // If form is dirty and user does a refresh,
    // the browser will ask about unsaved changes
    if (shouldBlockNav()) {
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
