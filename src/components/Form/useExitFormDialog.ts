import { useContext, useRef } from "react";

import {
  ExitFormDialogContext,
  ExitFormDialogData,
  SubmitFn
} from "./ExitFormDialogProvider";

export interface UseExitFormDialogResult
  extends Pick<
    ExitFormDialogData,
    "setEnableExitDialog" | "shouldBlockNavigation"
  > {
  setIsDirty: (isDirty: boolean) => void;
  setExitDialogSubmitRef: (submitFn: SubmitFn) => void;
}

const useExitFormDialog = (): UseExitFormDialogResult => {
  const id = useRef(Symbol()).current;

  const { setIsDirty, setExitDialogSubmitRef, ...rest } = useContext(
    ExitFormDialogContext
  );

  return {
    ...rest,
    setIsDirty: (value: boolean) => setIsDirty(id, value),
    setExitDialogSubmitRef: (submitFn: SubmitFn) =>
      setExitDialogSubmitRef(id, submitFn)
  };
};

export default useExitFormDialog;
