import React, { useContext, useRef } from "react";

import { ExitFormDialogContext } from "./ExitFormDialogProvider";
import { ExitFormDialogData, SubmitFn, WithFormId } from "./types";

export interface UseExitFormDialogResult
  extends Omit<ExitFormDialogData, "setIsDirty" | "setExitDialogSubmitRef">,
    WithFormId {
  setIsDirty: (isDirty: boolean) => void;
  setExitDialogSubmitRef: (submitFn: SubmitFn) => void;
}

interface UseExitFormDialogProps {
  formId: symbol | undefined;
  isDisabled?: boolean;
}

export const useExitFormDialog = (
  { formId, isDisabled }: UseExitFormDialogProps = { formId: undefined },
): UseExitFormDialogResult => {
  const id = useRef(formId || Symbol("exit-form-fallback-id")).current;
  const exitDialogProps = useContext(ExitFormDialogContext);
  const { setIsDirty, setIsSubmitDisabled, setExitDialogSubmitRef } = exitDialogProps;

  React.useEffect(() => {
    if (isDisabled !== undefined) {
      setIsSubmitDisabled(isDisabled);
    }
  }, [isDisabled]);

  return {
    ...exitDialogProps,
    formId: id,
    setIsDirty: (value: boolean) => setIsDirty(id, value),
    setExitDialogSubmitRef: (submitFn: SubmitFn) => setExitDialogSubmitRef(id, submitFn),
  };
};
