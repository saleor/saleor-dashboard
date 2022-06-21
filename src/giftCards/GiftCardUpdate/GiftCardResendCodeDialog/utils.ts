import { UserError } from "@saleor/types";
import { FormErrors, getFormErrors } from "@saleor/utils/errors";
import { useEffect, useState } from "react";

export function useDialogFormReset<
  TError extends UserError,
  TKey extends string
>({
  reset,
  apiErrors,
  keys,
  open,
}: {
  reset: () => void;
  apiErrors: TError[];
  keys: TKey[];
  open: boolean;
}) {
  const [formErrors, setFormErrors] = useState<FormErrors<TKey, TError>>(null);

  useEffect(() => {
    if (!open) {
      setFormErrors(null);
      reset();
    }
  }, [open]);

  useEffect(() => {
    const errors = getFormErrors(keys, apiErrors);
    setFormErrors(errors);
  }, [apiErrors]);

  return { formErrors };
}
