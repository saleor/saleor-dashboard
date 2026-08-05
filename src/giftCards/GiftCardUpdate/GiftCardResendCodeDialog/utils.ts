// @ts-strict-ignore
import { type UserError } from "@dashboard/types";
import { type FormErrors, getFormErrors } from "@dashboard/utils/errors";
import { useEffect, useState } from "react";

export function useDialogFormReset<TError extends UserError, TKey extends string>({
  reset,
  apiErrors,
  keys,
  open,
}: {
  reset: () => void;
  apiErrors: TError[] | undefined;
  keys: TKey[];
  open: boolean;
}) {
  const [formErrors, setFormErrors] = useState<FormErrors<TKey, TError>>(null);

  useEffect(() => {
    if (!open) {
      setFormErrors(null);
      reset();
    }
    // omit reset — useForm recreates it every render
  }, [open]);

  useEffect(() => {
    // Do not use `apiErrors ?? []` at call sites: a new [] each render loops here.
    if (!apiErrors?.length) {
      setFormErrors(null);

      return;
    }

    setFormErrors(getFormErrors(keys, apiErrors));
    // omit keys — callers pass inline arrays
  }, [apiErrors]);

  return { formErrors };
}
