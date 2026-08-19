import { Route } from "@dashboard/components/Router";
import { lazy, type ReactNode, Suspense } from "react";
import { Switch } from "react-router-dom";

import { newPasswordPath } from "../urls";
import LoginLoading from "./LoginLoading";

const NewPasswordStandalone = lazy(() => import("../views/NewPasswordStandalone"));

interface RootRoutesProps {
  // Content rendered behind the authentication gate (the app for logged-in users,
  // the login screen otherwise).
  children: ReactNode;
}

/**
 * Routes that must be reachable regardless of authentication state are declared
 * here, above the auth gate.
 *
 * In particular set/new password: an OIDC-authenticated user is logged in but still
 * needs to set a password. If this route lived only behind the auth gate, logged-in
 * users would fall through to the authenticated app's NotFound (404).
 */
export const RootRoutes = ({ children }: RootRoutesProps) => (
  <Switch>
    <Route
      path={newPasswordPath}
      render={props => (
        <Suspense fallback={<LoginLoading />}>
          <NewPasswordStandalone {...props} />
        </Suspense>
      )}
    />
    <Route>{children}</Route>
  </Switch>
);

RootRoutes.displayName = "RootRoutes";
