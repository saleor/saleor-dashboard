import { useStoreEmailUsedToLogin } from "@dashboard/auth/hooks/useStoreEmailUsedToLogin";
import { DEMO_MODE } from "@dashboard/config";
import useForm, { FormChange, SubmitPromise } from "@dashboard/hooks/useForm";
import useHandleFormSubmit from "@dashboard/hooks/useHandleFormSubmit";
import React from "react";

export interface LoginFormData {
  email: string;
  password: string;
}

export interface UseLoginFormResult {
  change: FormChange;
  data: LoginFormData;
  submit: () => SubmitPromise;
  reset: () => void;
}

export interface LoginFormProps {
  children: (props: UseLoginFormResult) => React.ReactNode;
  onSubmit: (data: LoginFormData) => SubmitPromise;
}

const getLoginFormData = (defaultEmail: string | null) => {
  if (DEMO_MODE) {
    return {
      email: "admin@example.com",
      password: "admin",
    };
  }

  return { email: defaultEmail, password: "" };
};

function useLoginForm(onSubmit: (data: LoginFormData) => SubmitPromise): UseLoginFormResult {
  const { emailUsedToLogin } = useStoreEmailUsedToLogin();
  const form = useForm(getLoginFormData(emailUsedToLogin));
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

const LoginForm: React.FC<LoginFormProps> = ({ children, onSubmit }) => {
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
