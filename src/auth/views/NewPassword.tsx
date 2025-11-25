import { AccountErrorFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { parseQs } from "@dashboard/url-utils";
import { useAuth } from "@saleor/sdk";
import { useState } from "react";
import { RouteComponentProps } from "react-router";

import NewPasswordPage, { NewPasswordPageFormData } from "../components/NewPasswordPage";
import { NewPasswordUrlQueryParams } from "../urls";

const NewPassword = ({ location }: RouteComponentProps) => {
  const navigate = useNavigator();
  const { setPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<AccountErrorFragment[]>([]);
  const params: NewPasswordUrlQueryParams = parseQs(location.search.substr(1)) as any;
  const handleSubmit = async (data: NewPasswordPageFormData) => {
    setLoading(true);

    const result = await setPassword({
      email: params.email,
      password: data.password,
      token: params.token,
    });
    const errors = (result.data?.setPassword?.errors || []) as AccountErrorFragment[];

    setErrors(errors);
    setLoading(false);

    if (!errors.length) {
      navigate("/", { replace: true });
    }
  };

  return <NewPasswordPage errors={errors} loading={loading} onSubmit={handleSubmit} />;
};

NewPassword.displayName = "NewPassword";
export default NewPassword;
