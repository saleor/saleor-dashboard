import { getAppMountUri } from "@dashboard/config";
import useNavigator from "@dashboard/hooks/useNavigator";

import ResetPasswordSuccessPage from "../components/ResetPasswordSuccessPage";

const ResetPasswordSuccessView = () => {
  const navigate = useNavigator();

  return <ResetPasswordSuccessPage onBack={() => navigate(getAppMountUri())} />;
};

ResetPasswordSuccessView.displayName = "ResetPasswordSuccessView";
export default ResetPasswordSuccessView;
