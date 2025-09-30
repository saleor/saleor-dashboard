import { AppDetailsUrlQueryParams, AppInstallUrlQueryParams, AppPaths } from "@dashboard/apps/urls";
import SectionRoute from "@dashboard/auth/components/SectionRoute";
import { Route } from "@dashboard/components/Router";
import { ExtensionsPaths } from "@dashboard/extensions/urls";
import { PermissionEnum } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { parse as parseQs } from "qs";
import { PropsWithChildren } from "react";
import { useIntl } from "react-intl";
import { Redirect, RouteComponentProps, Switch } from "react-router-dom";
import { AppInstallView, AppManageView, AppPermissionRequestView, AppView } from "src/apps/views";

import { WindowTitle } from "../components/WindowTitle";

/** @deprecated use /extensions view */
const AppManageRoute = ({ match }: PropsWithChildren<RouteComponentProps<{ id: string }>>) => {
  const qs = parseQs(location.search.substr(1));
  const params: AppDetailsUrlQueryParams = qs;

  return <AppManageView id={decodeURIComponent(match.params.id)} params={params} />;
};
/** @deprecated use /extensions view */
const AppViewRoute = ({ match }: PropsWithChildren<RouteComponentProps<{ id: string }>>) => (
  <AppView id={decodeURIComponent(match.params.id)} />
);
/** @deprecated use /extensions view */
const AppInstallRoute = (props: RouteComponentProps) => {
  const qs = parseQs(location.search.substr(1));
  const params: AppInstallUrlQueryParams = qs;

  return <AppInstallView params={params} {...props} />;
};

export const AppsSectionRoot = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.apps)} />
      <Switch>
        <SectionRoute
          exact
          permissions={[PermissionEnum.MANAGE_APPS]}
          path={AppPaths.appInstallPath}
          component={AppInstallRoute}
        />
        <Route exact path={AppPaths.resolveAppDetailsPath(":id")} component={AppManageRoute} />
        <SectionRoute
          exact
          permissions={[PermissionEnum.MANAGE_APPS]}
          path={AppPaths.resolveRequestPermissionsPath(":id")}
          component={AppPermissionRequestView}
        />
        <Route path={AppPaths.resolveAppPath(":id")} component={AppViewRoute} />
        <Redirect to={ExtensionsPaths.installedExtensions} path={AppPaths.appListPath} exact />
      </Switch>
    </>
  );
};
