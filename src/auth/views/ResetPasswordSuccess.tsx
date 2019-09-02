import React from "react";

import useNavigator from "@saleor/hooks/useNavigator";
import ResetPasswordSuccessPage from "../components/ResetPasswordSuccessPage";
import { loginUrl } from "../urls";

const ResetPasswordSuccessView: React.FC = () => {
  const navigate = useNavigator();

  return <ResetPasswordSuccessPage onBack={() => navigate(loginUrl)} />;
};
ResetPasswordSuccessView.displayName = "ResetPasswordSuccessView";
export default ResetPasswordSuccessView;
