import { CheckIfSaveIsDisabledFnType } from "@saleor/components/Form";
import { FormId } from "@saleor/components/Form/ExitFormDialogProvider";
import {
  useExitFormDialog,
  UseExitFormDialogResult,
} from "@saleor/components/Form/useExitFormDialog";
import useHandleFormSubmit from "@saleor/hooks/useHandleFormSubmit";
import { toggle } from "@saleor/utils/lists";
import isEqual from "lodash/isEqual";
import omit from "lodash/omit";
import React, { useEffect, useState } from "react";

import useStateFromProps from "./useStateFromProps";

export interface ChangeEvent<TData = any> {
  target: {
    name: string;
    value: TData;
  };
}
export type SubmitPromise<TData = any> = Promise<TData>;

export type FormChange<T = any> = (
  event: ChangeEvent<T>,
  cb?: () => void,
) => void;

export type FormErrors<T> = {
  [field in keyof T]?: string | React.ReactNode;
};

export interface UseFormOpts<T> {
  confirmLeave: boolean;
  formId?: FormId;
  checkIfSaveIsDisabled?: CheckIfSaveIsDisabledFnType<T>;
  disabled?: boolean;
}

export interface UseFormResult<TData>
  extends CommonUseFormResult<TData>,
    Pick<UseExitFormDialogResult, "formId"> {
  reset: () => void;
  set: (data: Partial<TData>) => void;
  triggerChange: () => void;
  handleChange: FormChange;
  toggleValue: FormChange;
  errors: FormErrors<TData>;
  setError: (name: keyof TData, error: string | React.ReactNode) => void;
  clearErrors: (name?: keyof TData | Array<keyof TData>) => void;
  setIsSubmitDisabled: (value: boolean) => void;
}

export interface CommonUseFormResult<TData> {
  data: TData;
  change: FormChange;
  submit: (dataOrEvent?: any) => SubmitPromise<any[]>;
  isSaveDisabled?: boolean;
}

export interface CommonUseFormResultWithHandlers<TData, THandlers>
  extends CommonUseFormResult<TData> {
  handlers: THandlers;
}

type FormData = Record<string, any | any[]>;

function merge<T extends FormData>(prevData: T, prevState: T, data: T): T {
  return Object.keys(prevState).reduce(
    (acc, key) => {
      if (!isEqual(data[key], prevData[key])) {
        acc[key as keyof T] = data[key];
      }

      return acc;
    },
    { ...prevState },
  );
}

function useForm<T extends FormData, TErrors>(
  initialData: T,
  onSubmit?: (data: T) => SubmitPromise<TErrors[]> | void,
  opts: UseFormOpts<T> = { confirmLeave: false, formId: undefined },
): UseFormResult<T> {
  const {
    confirmLeave,
    formId: propsFormId,
    checkIfSaveIsDisabled,
    disabled,
  } = opts;
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [data, setData] = useStateFromProps(initialData, {
    mergeFunc: merge,
  });

  const isSaveDisabled = () => {
    if (checkIfSaveIsDisabled) {
      return checkIfSaveIsDisabled(data);
    }

    return !!disabled;
  };

  const {
    setIsDirty: setIsFormDirtyInExitDialog,
    setExitDialogSubmitRef,
    setEnableExitDialog,
    setIsSubmitDisabled,
    formId,
  } = useExitFormDialog({
    formId: propsFormId,
    isDisabled: isSaveDisabled(),
  });

  const handleFormSubmit = useHandleFormSubmit({
    formId,
    onSubmit,
  });

  const handleSetChanged = (value: boolean = true) => {
    if (confirmLeave) {
      setIsFormDirtyInExitDialog(value);
    }
  };

  const setExitDialogData = () => {
    setEnableExitDialog(true);

    if (!onSubmit) {
      return;
    }

    setExitDialogSubmitRef(submit);
  };

  useEffect(setExitDialogData, [onSubmit, data]);

  function toggleValue(event: ChangeEvent, cb?: () => void) {
    const { name, value } = event.target;
    const field = data[name as keyof T];

    if (Array.isArray(field)) {
      handleSetChanged(true);

      setData({
        ...data,
        [name]: toggle(value, field, isEqual),
      });
    }

    if (typeof cb === "function") {
      cb();
    }
  }

  const handleChange: FormChange = event => {
    change(event);
    handleSetChanged(true);
  };

  function change(event: ChangeEvent) {
    const { name, value } = event.target;

    if (!(name in data)) {
      console.error(`Unknown form field: ${name}`);
      return;
    } else {
      if (data[name] !== value) {
        handleSetChanged(true);
      }
      setData(data => ({
        ...data,
        [name]: value,
      }));
    }
  }

  function reset() {
    setData(initialData);
  }

  function set(newData: Partial<T>) {
    setData(data => ({
      ...data,
      ...newData,
    }));
  }

  async function submit() {
    if (typeof onSubmit === "function" && !Object.keys(errors).length) {
      const result = handleFormSubmit(data);

      return result;
    }
  }

  const setError = (field: keyof T, error: string | React.ReactNode) =>
    setErrors(e => ({ ...e, [field]: error }));

  const clearErrors = (field?: keyof T | Array<keyof T>) => {
    if (!field) {
      setErrors({});
    } else {
      setErrors(errors =>
        omit<FormErrors<T>>(errors, Array.isArray(field) ? field : [field]),
      );
    }
  };

  return {
    formId,
    setError,
    errors,
    change,
    clearErrors,
    data,
    reset,
    set,
    submit,
    toggleValue,
    handleChange,
    triggerChange: handleSetChanged,
    setIsSubmitDisabled,
    isSaveDisabled: isSaveDisabled(),
  };
}

export default useForm;
