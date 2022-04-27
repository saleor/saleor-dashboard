import { APP_MOUNT_URL } from "@saleor/config";
import useNavigator from "@saleor/hooks/useNavigator";
import React from "react";

import ResetPasswordSuccessPage from "../components/ResetPasswordSuccessPage";

const ResetPasswordSuccessView: React.FC = () => {
  const navigate = useNavigator();

  return <ResetPasswordSuccessPage onBack={() => navigate(APP_MOUNT_URL)} />;
};
ResetPasswordSuccessView.displayName = "ResetPasswordSuccessView";
export default ResetPasswordSuccessView;
