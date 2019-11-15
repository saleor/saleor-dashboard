import React from "react";
import { Route, RouteProps } from "react-router-dom";

import useUser from "@saleor/hooks/useUser";
import NotFound from "../../NotFound";
import { PermissionEnum } from "../../types/globalTypes";
import { hasPermission } from "../misc";

interface SectionRouteProps extends RouteProps {
  permissions?: PermissionEnum[];
}

export const SectionRoute: React.FC<SectionRouteProps> = ({
  permissions,
  ...props
}) => {
  const { user } = useUser();

  const hasPermissions =
    !permissions ||
    permissions
      .map(permission => hasPermission(permission, user))
      .reduce((prev, curr) => prev && curr);
  return hasPermissions ? <Route {...props} /> : <NotFound />;
};
SectionRoute.displayName = "Route";
export default SectionRoute;
