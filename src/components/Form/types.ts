import { type SubmitPromise } from "@dashboard/hooks/useForm";
import type * as React from "react";

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
  setExitDialogDescription: (description: React.ReactNode | null) => void;
  /**
   * When true for a dirty form, closing a URL-driven dialog (e.g. clearing `?action=`)
   * is treated as leaving and shows the exit prompt. Page forms leave this off so
   * opening/closing unrelated modals never interrupts editing.
   */
  setBlockDialogClose: (id: symbol, value: boolean) => void;
  shouldBlockNavigation: () => boolean;
  showDialog: boolean;
  setIsSubmitting: (value: boolean) => void;
  leave: () => void;
  setIsSubmitDisabled: (value: boolean) => void;
  resetFormsState: () => void;
  unregisterForm: (id: symbol) => void;
}

export interface FormData {
  isDirty: boolean;
  submitFn: SubmitFn | null;
  blockDialogClose?: boolean;
}
