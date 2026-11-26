import useNavigator from "@dashboard/hooks/useNavigator";

import { ResetPasswordSuccessPage } from "../components/ResetPasswordSuccessPage/ResetPasswordSuccessPage";

const ResetPasswordSuccessView = () => {
  const navigate = useNavigator();

  // A router path: the router's basename already holds the mount URI.
  return <ResetPasswordSuccessPage onBack={() => navigate("/")} />;
};

ResetPasswordSuccessView.displayName = "ResetPasswordSuccessView";
export default ResetPasswordSuccessView;
