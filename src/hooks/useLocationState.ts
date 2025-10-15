import { ExtensionsPaths, LegacyAppSections } from "@dashboard/extensions/urls";
import { matchPath, useLocation } from "react-router";

// Exported for testing. Fix this. Once we drop legacy behavior, maybe we can drop this suite
export const isAppPath = (pathname: string) =>
  !!matchPath(pathname, {
    path: `${LegacyAppSections.appsSection}:id`,
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
