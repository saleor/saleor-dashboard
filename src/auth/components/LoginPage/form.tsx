import { DEMO_MODE } from "@saleor/config";
import useForm, { FormChange, SubmitPromise } from "@saleor/hooks/useForm";
import useHandleFormSubmit from "@saleor/hooks/useHandleFormSubmit";
import React from "react";

export interface LoginFormData {
  email: string;
  password: string;
}

export interface UseLoginFormResult {
  change: FormChange;
  data: LoginFormData;
  submit: () => SubmitPromise;
}

export interface LoginFormProps {
  children: (props: UseLoginFormResult) => React.ReactNode;
  onSubmit: (data: LoginFormData) => SubmitPromise;
}

const getLoginFormData = () => {
  if (DEMO_MODE) {
    return {
      email: "admin@example.com",
      password: "admin",
    };
  }
  return { email: "", password: "" };
};

function useLoginForm(
  onSubmit: (data: LoginFormData) => SubmitPromise,
): UseLoginFormResult {
  const form = useForm(getLoginFormData());

  const { change, data } = form;

  const handleFormSubmit = useHandleFormSubmit({ onSubmit });

  const submit = async () => handleFormSubmit(data);

  return {
    change,
    data,
    submit,
  };
}

const LoginForm: React.FC<LoginFormProps> = ({ children, onSubmit }) => {
  const props = useLoginForm(onSubmit);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // Cypress tests blow up without it
    event.preventDefault();
    props.submit();
  };

  return <form onSubmit={handleSubmit}>{children(props)}</form>;
};

LoginForm.displayName = "LoginForm";
export default LoginForm;
