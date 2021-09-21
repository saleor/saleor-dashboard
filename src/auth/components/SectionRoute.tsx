import useUser from "@saleor/hooks/useUser";
import React from "react";
import { Route, RouteProps } from "react-router-dom";

import NotFound from "../../NotFound";
import { PermissionEnum } from "../../types/globalTypes";
import { hasPermissions } from "../misc";

interface SectionRouteProps extends RouteProps {
  permissions?: PermissionEnum[];
}

export const SectionRoute: React.FC<SectionRouteProps> = ({
  permissions,
  ...props
}) => {
  const { user } = useUser();

  const hasSectionPermissions =
    !permissions || hasPermissions(permissions, user);

  return hasSectionPermissions ? <Route {...props} /> : <NotFound />;
};
SectionRoute.displayName = "Route";
export default SectionRoute;
