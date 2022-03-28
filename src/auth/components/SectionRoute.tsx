import { PermissionEnum } from "@saleor/graphql";
import React from "react";
import { Route, RouteProps } from "react-router-dom";

import { useUser } from "..";
import NotFound from "../../NotFound";
import { hasAllPermissions, hasAnyPermissions } from "../misc";

type MatchPermissionType = "all" | "any";

interface SectionRouteProps extends RouteProps {
  permissions?: PermissionEnum[];
  matchPermission?: MatchPermissionType;
}

const matchAll = (match: MatchPermissionType) => match === "all";

export const SectionRoute: React.FC<SectionRouteProps> = ({
  permissions,
  matchPermission = "all",
  ...props
}) => {
  const { user } = useUser();

  // Prevents race condition
  if (user === undefined) {
    return null;
  }

  const hasSectionPermissions = () => {
    if (!permissions) {
      return true;
    }

    if (matchAll(matchPermission)) {
      return hasAllPermissions(permissions, user);
    }

    return hasAnyPermissions(permissions, user);
  };

  return hasSectionPermissions() ? <Route {...props} /> : <NotFound />;
};
SectionRoute.displayName = "Route";
export default SectionRoute;
