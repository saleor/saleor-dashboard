import { appsSection } from "@saleor/apps/urls";
import { matchPath, useLocation } from "react-router";

const isAppPath = (pathname: string) =>
  !!matchPath(pathname, {
    path: `${appsSection}:id`,
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
