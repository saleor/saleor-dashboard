import useForm, { type FormChange, type SubmitPromise } from "@dashboard/hooks/useForm";
import useHandleFormSubmit from "@dashboard/hooks/useHandleFormSubmit";
import { type FormEvent, type ReactNode } from "react";

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
  children: (props: UseLoginFormResult) => ReactNode;
  onSubmit: (data: LoginFormData) => SubmitPromise;
}

const getLoginFormData = (): LoginFormData => ({ email: "", password: "" });

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

export const LoginForm = ({ children, onSubmit }: LoginFormProps): ReactNode => {
  const props = useLoginForm(onSubmit);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    await props.submit();
    props.reset();
  };

  return <form onSubmit={handleSubmit}>{children(props)}</form>;
};

LoginForm.displayName = "LoginForm";
