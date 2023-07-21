import { AppPaths } from "@dashboard/apps/urls";
import useNavigator from "@dashboard/hooks/useNavigator";

const errors = {
  USER_DENIED_PERMISSIONS: "USER_DENIED_PERMISSIONS",
};

// todo: test
export const usePermissionsRequestRedirects = ({
  appId,
  redirectPath,
}: {
  appId: string;
  redirectPath: string;
}) => {
  const navigate = useNavigator();

  const navigateToAppApproved = () => {
    navigate(
      AppPaths.resolveAppPath(encodeURIComponent(appId)) +
        `?appPath=${redirectPath}`,
    );
  };

  const navigateToAppDenied = () => {
    navigate(
      AppPaths.resolveAppPath(encodeURIComponent(appId)) +
        `?appPath=${redirectPath}&error=${errors.USER_DENIED_PERMISSIONS}`,
    );
  };

  return {
    navigateToAppApproved,
    navigateToAppDenied,
  };
};
