import { SubmitPromise } from "@dashboard/hooks/useForm";
import * as React from "react";

export type SubmitFn = (event?: React.FormEvent) => SubmitPromise;

export type FormId = symbol;

export type FormsData = Record<FormId, FormData>;

export interface WithFormId {
  formId: FormId;
}

export interface ExitFormDialogData {
  setIsDirty: (id: symbol, isDirty: boolean) => void;
  setExitDialogSubmitRef: (id: symbol, submitFn: SubmitFn) => void;
  setEnableExitDialog: (value: boolean) => void;
  shouldBlockNavigation: () => boolean;
  setIsSubmitting: (value: boolean) => void;
  leave: () => void;
  setIsSubmitDisabled: (value: boolean) => void;
}

export interface FormData {
  isDirty: boolean;
  submitFn: SubmitFn | null;
}
