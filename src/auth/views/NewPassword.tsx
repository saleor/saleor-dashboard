import useNavigator from "@saleor/hooks/useNavigator";
import { SetPasswordData, useAuth } from "@saleor/sdk";
import { parse as parseQs } from "qs";
import React, { useState } from "react";
import { RouteComponentProps } from "react-router";

import NewPasswordPage, {
  NewPasswordPageFormData,
} from "../components/NewPasswordPage";
import { NewPasswordUrlQueryParams } from "../urls";

const NewPassword: React.FC<RouteComponentProps> = ({ location }) => {
  const navigate = useNavigator();

  const { setPassword } = useAuth();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<SetPasswordData["errors"]>([]);

  const params: NewPasswordUrlQueryParams = parseQs(location.search.substr(1));

  const handleSubmit = async (data: NewPasswordPageFormData) => {
    setLoading(true);

    const result = await setPassword({
      email: params.email,
      password: data.password,
      token: params.token,
    });

    const errors = result.data?.setPassword?.errors || [];

    setErrors(errors);
    setLoading(false);

    if (!errors.length) {
      navigate("/", { replace: true });
    }
  };

  return (
    <NewPasswordPage
      errors={errors}
      disabled={loading}
      onSubmit={handleSubmit}
    />
  );
};

NewPassword.displayName = "NewPassword";
export default NewPassword;
