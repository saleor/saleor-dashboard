import useForm, { SubmitPromise, UseFormResult } from "@saleor/hooks/useForm";
import React from "react";

import { ExitFormPromptData } from "./ExitFormPromptProvider";

export interface FormProps<T>
  extends Omit<React.HTMLProps<HTMLFormElement>, "onSubmit">,
    ExitFormPromptData {
  children: (props: UseFormResult<T>) => React.ReactNode;
  confirmLeave?: boolean;
  initial?: T;
  resetOnSubmit?: boolean;
  onSubmit?: (data: T) => SubmitPromise | void;
}

function Form<T>({
  children,
  initial,
  resetOnSubmit,
  onSubmit,
  confirmLeave,
  setIsDirty,
  formRef,
  ...rest
}: FormProps<T>) {
  const renderProps = useForm(initial, onSubmit, { confirmLeave, formId });

  function handleSubmit(event?: React.FormEvent<any>, cb?: () => void) {
    const { reset, submit } = renderProps;

    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    if (cb) {
      cb();
    }

    if (resetOnSubmit) {
      reset();
    }

    submit();
  }

  return (
    <form {...rest} onSubmit={handleSubmit}>
      {children(renderProps)}
    </form>
  );
}
Form.displayName = "Form";

export default Form;
