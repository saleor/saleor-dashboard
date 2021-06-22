import { ExitFormPromptContext } from "@saleor/components/Form/ExitFormPromptProvider";
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
  setChanged: (value: boolean) => void;
  toggleValue: FormChange;
  errors: FormErrors<T>;
  setChanged: (value: boolean) => void;
  setError: (name: keyof T, error: string | React.ReactNode) => void;
  clearErrors: (name?: keyof T | Array<keyof T>) => void;
  confirmLeave?: boolean;
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
  onSubmit?: (data: T) => SubmitPromise | void,
  confirmLeave = false
): UseFormResult<T> {
  const [hasChanged, setChanged] = useState(false);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [data, setData] = useStateFromProps(initial, {
    mergeFunc: merge,
    onRefresh: newData => handleRefresh(data, newData, handleSetChanged)
  });

  // const locationPath = useRef(null);

  // const history = useHistory();

  // useEffect(() => {
  //   history.listen((location, action) => {
  //     console.log({ location, action });
  //     if (location.pathname !== locationPath.current) {
  //       locationPath.current = location.pathname;
  //       handleSetChanged(false);
  //     }
  //   });
  // }, []);

  const {
    setIsDirty: setIsFormDirtyInExitPrompt,
    setExitPromptSubmitRef,
    setEnableExitPrompt
  } = useContext(ExitFormPromptContext);

  const handleSetChanged = (value: boolean = true) => {
    setChanged(value);

    if (confirmLeave) {
      setIsFormDirtyInExitPrompt(value);
    }
  };

  const setExitPromptData = () => {
    setEnableExitPrompt(true);

    if (!onSubmit) {
      return;
    }

    setExitPromptSubmitRef(submit);
  };

  useEffect(setExitPromptData, [onSubmit]);

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
    setData(initial);
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
        setEnableExitPrompt
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
    setChanged,
    set,
    submit,
    toggleValue,
    triggerChange: handleSetChanged,
    setChanged: handleSetChanged
  };
}

export default useForm;
