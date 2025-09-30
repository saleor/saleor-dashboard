import useForm, { FormChange, SubmitPromise } from "@dashboard/hooks/useForm";
import useHandleFormSubmit from "@dashboard/hooks/useHandleFormSubmit";
import * as React from "react";

export interface LoginFormData {
  email: string;
  password: string;
}

interface UseLoginFormResult {
  change: FormChange;
  data: LoginFormData;
  submit: () => SubmitPromise;
  reset: () => void;
}

interface LoginFormProps {
  children: (props: UseLoginFormResult) => React.ReactNode;
  onSubmit: (data: LoginFormData) => SubmitPromise;
}

const getLoginFormData = () => {
  return { email: "", password: "" };
};

function useLoginForm(onSubmit: (data: LoginFormData) => SubmitPromise): UseLoginFormResult {
  const form = useForm(getLoginFormData());
  const { change, data, reset } = form;
  const handleFormSubmit = useHandleFormSubmit({ onSubmit });
  const submit = async () => handleFormSubmit(data);

  return {
    change,
    reset,
    data,
    submit,
  };
}

const LoginForm = ({ children, onSubmit }: LoginFormProps) => {
  const props = useLoginForm(onSubmit);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await props.submit();

    props.reset(); // clear fields after submit
  };

  return <form onSubmit={handleSubmit}>{children(props)}</form>;
};

LoginForm.displayName = "LoginForm";
export default LoginForm;
