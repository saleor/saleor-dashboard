import { ExitFormDialogContext } from "@saleor/components/Form/ExitFormDialogProvider";
import handleFormSubmit from "@saleor/utils/handlers/handleFormSubmit";
import { toggle } from "@saleor/utils/lists";
import isEqual from "lodash/isEqual";
import omit from "lodash/omit";
import React, { useContext, useEffect } from "react";
import { useState } from "react";

import useStateFromProps from "./useStateFromProps";

export interface ChangeEvent<TData = any> {
  target: {
    name: string;
    value: TData;
  };
}
export type SubmitPromise<TData = any> = Promise<TData>;

export type FormChange = (event: ChangeEvent) => void;

export type FormErrors<T> = {
  [field in keyof T]?: string | React.ReactNode;
};

export interface UseFormOpts {
  confirmLeave: boolean;
}

export interface UseFormResult<TData> extends CommonUseFormResult<TData> {
  reset: () => void;
  set: (data: Partial<TData>) => void;
  triggerChange: () => void;
  setChanged: (value: boolean) => void;
  handleChange: FormChange;
  toggleValue: FormChange;
  errors: FormErrors<TData>;
  setError: (name: keyof TData, error: string | React.ReactNode) => void;
  clearErrors: (name?: keyof TData | Array<keyof TData>) => void;
}

export interface CommonUseFormResult<TData> {
  data: TData;
  change: FormChange;
  hasChanged: boolean;
  submit: () => void;
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
    { ...prevState }
  );
}

function handleRefresh<T extends FormData>(
  data: T,
  newData: T,
  setChanged: (status: boolean) => void
) {
  if (isEqual(data, newData)) {
    setChanged(false);
  }
}

function useForm<T extends FormData>(
  initialData: T,
  onSubmit?: (data: T) => SubmitPromise | void,
  opts?: UseFormOpts
): UseFormResult<T> {
  const { confirmLeave } = opts;
  const [hasChanged, setChanged] = useState(false);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [data, setData] = useStateFromProps(initialData, {
    mergeFunc: merge,
    onRefresh: newData => handleRefresh(data, newData, handleSetChanged)
  });

  const {
    setIsDirty: setIsFormDirtyInExitDialog,
    setExitDialogSubmitRef,
    setEnableExitDialog
  } = useContext(ExitFormDialogContext);

  const handleSetChanged = (value: boolean = true) => {
    setChanged(value);

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

  useEffect(setExitDialogData, [onSubmit]);

  function toggleValue(event: ChangeEvent, cb?: () => void) {
    const { name, value } = event.target;
    const field = data[name as keyof T];

    if (Array.isArray(field)) {
      if (!hasChanged) {
        handleSetChanged(true);
      }

      setData({
        ...data,
        [name]: toggle(value, field, isEqual)
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
        [name]: value
      }));
    }
  }

  function reset() {
    setData(initialData);
  }

  function set(newData: Partial<T>, setHasChanged = true) {
    setData(data => ({
      ...data,
      ...newData
    }));
    handleSetChanged(setHasChanged);
  }

  async function submit() {
    if (typeof onSubmit === "function" && !Object.keys(errors).length) {
      const result = handleFormSubmit(
        data,
        onSubmit,
        handleSetChanged,
        setEnableExitDialog
      );

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
        omit<FormErrors<T>>(errors, Array.isArray(field) ? field : [field])
      );
    }
  };

  return {
    setError,
    errors,
    change,
    clearErrors,
    data,
    hasChanged,
    reset,
    set,
    submit,
    toggleValue,
    handleChange,
    triggerChange: handleSetChanged,
    setChanged: handleSetChanged
  };
}

export default useForm;
