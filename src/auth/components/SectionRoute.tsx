import { PermissionEnum } from "@dashboard/graphql";
import React from "react";
import { Outlet, PathRouteProps, Route } from "react-router-dom";

import NotFound from "../../NotFound";
import { useUser } from "..";
import { hasAllPermissions, hasAnyPermissions } from "../misc";

type MatchPermissionType = "all" | "any";

interface SectionRouteProps extends PathRouteProps {
  permissions?: PermissionEnum[];
  matchPermission?: MatchPermissionType;
  exact?: boolean;
}

const matchAll = (match: MatchPermissionType) => match === "all";

export const PermissionBasedRoute: React.FC<SectionRouteProps> = ({
  permissions,
  matchPermission = "all",
  children,
}) => {
  const { user } = useUser();

  // Prevents race condition
  if (user === undefined) {
    return <Outlet />;
  }

  const hasSectionPermissions = () => {
    if (!permissions) {
      return true;
    }

    if (matchAll(matchPermission)) {
      return hasAllPermissions(permissions, user!);
    }

    return hasAnyPermissions(permissions, user!);
  };

  return hasSectionPermissions() ? children : <NotFound />;
};

export const SectionRoute: React.FC<SectionRouteProps> = ({
  permissions,
  matchPermission = "all",
  ...props
}) => {
  const { user } = useUser();

  // Prevents race condition
  if (user === undefined) {
    return <></>;
  }

  const hasSectionPermissions = () => {
    if (!permissions) {
      return true;
    }

    if (matchAll(matchPermission)) {
      return hasAllPermissions(permissions, user!);
    }

    return hasAnyPermissions(permissions, user!);
  };

  return (
    <Route
      {...props}
      element={hasSectionPermissions() ? props.element : <NotFound />}
    />
  );
};
SectionRoute.displayName = "Route";
export default SectionRoute;
