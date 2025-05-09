import { AppSections } from "@dashboard/apps/urls";
import { ExtensionsPaths } from "@dashboard/extensions/urls";
import { matchPath, useLocation } from "react-router";

const isAppPath = (pathname: string) =>
  !!matchPath(pathname, {
    path: `${AppSections.appsSection}:id`,
  }) ||
  !!matchPath(pathname, {
    path: ExtensionsPaths.resolveViewManifestExtension(":id"),
  });

/*
 * Use detailed information about the current location.
 */
export const useLocationState = () => {
  const location = useLocation();

  return {
    isAppPath: isAppPath(location.pathname),
  };
};
