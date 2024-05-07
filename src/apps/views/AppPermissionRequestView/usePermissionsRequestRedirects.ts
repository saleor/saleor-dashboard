import { AppPaths } from "@dashboard/apps/urls";
import useNavigator from "@dashboard/hooks/useNavigator";

type Errors = "USER_DENIED_PERMISSIONS" | "UPDATE_PERMISSIONS_FAILED";

export const usePermissionsRequestRedirects = ({
  appId,
  redirectPath,
}: {
  appId: string;
  redirectPath: string;
}) => {
  const navigate = useNavigator();
  const navigateToAppApproved = () => {
    navigate(AppPaths.resolveAppPath(encodeURIComponent(appId)) + `?appPath=${redirectPath}`);
  };
  const navigateToAppDenied = (error: Errors) => {
    navigate(
      AppPaths.resolveAppPath(encodeURIComponent(appId)) +
        `?appPath=${redirectPath}&error=${error}`,
    );
  };

  return {
    navigateToAppApproved,
    navigateToAppDenied,
  };
};
