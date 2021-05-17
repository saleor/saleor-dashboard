import { toggle } from "@saleor/utils/lists";
import isEqual from "lodash/isEqual";
import omit from "lodash/omit";
import React from "react";
import { useState } from "react";

import useStateFromProps from "./useStateFromProps";

export interface ChangeEvent<TData = any> {
  target: {
    name: string;
    value: TData;
  };
}
export type SubmitPromise = Promise<any[]>;

export type FormChange = (event: ChangeEvent, cb?: () => void) => void;

export type FormErrors<T> = {
  [field in keyof T]?: string | React.ReactNode;
};

export interface UseFormResult<T> {
  change: FormChange;
  data: T;
  hasChanged: boolean;
  reset: () => void;
  set: (data: Partial<T>) => void;
  submit: () => void;
  triggerChange: () => void;
  toggleValue: FormChange;
  errors: FormErrors<T>;
  setError: (name: keyof T, error: string | React.ReactNode) => void;
  clearErrors: (name?: keyof T | Array<keyof T>) => void;
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
  initial: T,
  onSubmit?: (data: T) => SubmitPromise | void
): UseFormResult<T> {
  const [hasChanged, setChanged] = useState(false);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [data, setData] = useStateFromProps(initial, {
    mergeFunc: merge,
    onRefresh: newData => handleRefresh(data, newData, setChanged)
  });

  function toggleValue(event: ChangeEvent, cb?: () => void) {
    const { name, value } = event.target;
    const field = data[name as keyof T];

    if (Array.isArray(field)) {
      if (!hasChanged) {
        setChanged(true);
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

  function change(event: ChangeEvent) {
    const { name, value } = event.target;

    if (!(name in data)) {
      console.error(`Unknown form field: ${name}`);
      return;
    } else {
      if (data[name] !== value) {
        setChanged(true);
      }
      setData(data => ({
        ...data,
        [name]: value
      }));
    }
  }

  function reset() {
    setData(initial);
  }

  function set(newData: Partial<T>, setHasChanged = true) {
    setData(data => ({
      ...data,
      ...newData
    }));
    setChanged(setHasChanged);
  }

  async function submit() {
    if (typeof onSubmit === "function" && !Object.keys(errors).length) {
      const result = onSubmit(data);
      if (result) {
        const errors = await result;
        if (errors?.length === 0) {
          setChanged(false);
        }
      }
    }
  }

  function triggerChange() {
    setChanged(true);
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
    triggerChange
  };
}

export default useForm;
