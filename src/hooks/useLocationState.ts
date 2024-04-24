import { AppSections } from "@dashboard/apps/urls";
import { matchPath, useLocation } from "react-router";

const isAppPath = (pathname: string) =>
  !!matchPath({ path: `${AppSections.appsSection}:id` }, pathname);

/*
 * Use detailed information about the current location.
 */
export const useLocationState = () => {
  const location = useLocation();

  return {
    isAppPath: isAppPath(location.pathname),
  };
};
