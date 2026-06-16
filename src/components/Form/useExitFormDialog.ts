import { useContext, useEffect, useRef } from "react";

import { ExitFormDialogContext } from "./ExitFormDialogProvider";
import { type ExitFormDialogData, type SubmitFn, type WithFormId } from "./types";

export interface UseExitFormDialogResult
  extends Omit<ExitFormDialogData, "setIsDirty" | "setExitDialogSubmitRef" | "unregisterForm">,
    WithFormId {
  setIsDirty: (isDirty: boolean) => void;
  setExitDialogSubmitRef: (submitFn: SubmitFn) => void;
  unregisterForm: () => void;
}

interface UseExitFormDialogProps {
  formId: symbol | undefined;
  isDisabled?: boolean;
}

/** @deprecated Use react-hook-form instead */
export const useExitFormDialog = (
  { formId, isDisabled }: UseExitFormDialogProps = { formId: undefined },
): UseExitFormDialogResult => {
  const id = useRef(formId || Symbol("exit-form-fallback-id")).current;
  const exitDialogProps = useContext(ExitFormDialogContext);
  const { setIsDirty, setIsSubmitDisabled, setExitDialogSubmitRef, unregisterForm } =
    exitDialogProps;

  useEffect(() => {
    if (isDisabled !== undefined) {
      setIsSubmitDisabled(isDisabled);
    }
  }, [isDisabled]);

  useEffect(() => {
    return () => {
      unregisterForm(id);
    };
  }, [id, unregisterForm]);

  return {
    ...exitDialogProps,
    formId: id,
    setIsDirty: (value: boolean) => setIsDirty(id, value),
    setExitDialogSubmitRef: (submitFn: SubmitFn) => setExitDialogSubmitRef(id, submitFn),
    unregisterForm: () => unregisterForm(id),
  };
};
