import useNavigator from "@saleor/hooks/useNavigator";
import { useAuth } from "@saleor/sdk";
import { AccountErrorFragment } from "@saleor/sdk/dist/apollo/types";
import { parse as parseQs } from "qs";
import React, { useState } from "react";
import { RouteComponentProps } from "react-router";

import NewPasswordPage, {
  NewPasswordPageFormData
} from "../components/NewPasswordPage";
import { NewPasswordUrlQueryParams } from "../urls";

const NewPassword: React.FC<RouteComponentProps> = ({ location }) => {
  const navigate = useNavigator();

  const { setPassword } = useAuth();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<
    Array<Pick<AccountErrorFragment, "code" | "field">>
  >();

  const params: NewPasswordUrlQueryParams = parseQs(location.search.substr(1));

  const handleSubmit = async (data: NewPasswordPageFormData) => {
    setLoading(true);

    const result = await setPassword({
      email: params.email,
      password: data.password,
      token: params.token
    });

    setErrors(result.data?.setPassword?.errors);
    setLoading(false);

    navigate("/", { replace: true });
  };

  return (
    <NewPasswordPage
      errors={errors || []}
      disabled={loading}
      onSubmit={handleSubmit}
    />
  );
};

NewPassword.displayName = "NewPassword";
export default NewPassword;
