import { DEMO_MODE } from "@saleor/config";
import useForm, { FormChange, SubmitPromise } from "@saleor/hooks/useForm";
import handleFormSubmit from "@saleor/utils/handlers/handleFormSubmit";
import React from "react";

export interface LoginFormData {
  email: string;
  password: string;
}

export interface UseLoginFormResult {
  change: FormChange;
  data: LoginFormData;
  hasChanged: boolean;
  submit: () => Promise<boolean>;
}

export interface LoginFormProps {
  children: (props: UseLoginFormResult) => React.ReactNode;
  onSubmit: (data: LoginFormData) => SubmitPromise;
}

const getLoginFormData = () => {
  if (DEMO_MODE) {
    return {
      email: "admin@example.com",
      password: "admin"
    };
  }
  return { email: "", password: "" };
};

function useLoginForm(
  onSubmit: (data: LoginFormData) => SubmitPromise
): UseLoginFormResult {
  const [changed, setChanged] = React.useState(false);
  const triggerChange = () => setChanged(true);

  const form = useForm(getLoginFormData());

  const handleChange: FormChange = (event, cb) => {
    form.change(event, cb);
    triggerChange();
  };

  const data: LoginFormData = {
    ...form.data
  };

  const handleSubmit = async (data: LoginFormData) => {
    const errors = await onSubmit(data);

    return errors;
  };

  const submit = async () => handleFormSubmit(data, handleSubmit, setChanged);

  return {
    change: handleChange,
    data,
    hasChanged: changed,
    submit
  };
}

const LoginForm: React.FC<LoginFormProps> = ({ children, onSubmit }) => {
  const props = useLoginForm(onSubmit);

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

LoginForm.displayName = "LoginForm";
export default LoginForm;
