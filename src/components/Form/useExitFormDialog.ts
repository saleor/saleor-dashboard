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
  formId: symbol;
}

export interface UseExitFormDialogProps {
  formId: symbol;
}

const useExitFormDialog = (
  { formId }: UseExitFormDialogProps = { formId: null }
): UseExitFormDialogResult => {
  const id = useRef(formId || Symbol()).current;

  const { setIsDirty, setExitDialogSubmitRef, ...rest } = useContext(
    ExitFormDialogContext
  );

  return {
    ...rest,
    formId: id,
    setIsDirty: (value: boolean) => setIsDirty(id, value),
    setExitDialogSubmitRef: (submitFn: SubmitFn) =>
      setExitDialogSubmitRef(id, submitFn)
  };
};

export default useExitFormDialog;
