import { appsSection } from "@saleor/apps/urls";
import { matchPath, useLocation } from "react-router";

const isAppPath = (pathname: string) =>
  !!matchPath(pathname, {
    path: `${appsSection}:id`,
  });

export const useLocationState = () => {
  const location = useLocation();

  return {
    isAppPath: isAppPath(location.pathname),
  };
};
