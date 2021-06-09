import {
  ExitFormPromptContext,
  ExitFormPromptData
} from "@saleor/channels/views/ChannelDetails/ExitFormPromptProvider";
import useForm, { SubmitPromise, UseFormResult } from "@saleor/hooks/useForm";
import React, {
  Ref,
  RefObject,
  useEffect,
  useImperativeHandle,
  useRef
} from "react";

export interface FormProps<T> {
  children: (props: UseFormResult<T>) => React.ReactNode;
  confirmLeave?: boolean;
  initial?: T;
  resetOnSubmit?: boolean;
  onSubmit?: (data: T) => SubmitPromise | void;
}

type FormPropsWithPromptData<T> = FormProps<T> & ExitFormPromptData;

function Form<T>({
  children,
  initial,
  resetOnSubmit,
  onSubmit,
  confirmLeave,
  setIsDirty,
  formRef
}: FormPropsWithPromptData<T>) {
  const renderProps = useForm(initial, onSubmit);
  const { hasChanged } = renderProps;

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

    return submit();
  }

  const formElRef = useRef<HTMLFormElement>();

  const handleSetPromptData = () => {
    if (!confirmLeave) {
      return;
    }

    setIsDirty(hasChanged);
  };

  useEffect(handleSetPromptData, [hasChanged]);

  useImperativeHandle(formRef, () => ({
    submit: handleSubmit
  }));

  return (
    <form ref={formElRef} onSubmit={handleSubmit}>
      {children(renderProps)}
    </form>
  );
}

Form.displayName = "Form";

function FormWrapper<T>(props: FormProps<T>) {
  return (
    <ExitFormPromptContext.Consumer>
      {exitFormPromptData => <Form {...props} {...exitFormPromptData} />}
    </ExitFormPromptContext.Consumer>
  );
}

export default FormWrapper;
