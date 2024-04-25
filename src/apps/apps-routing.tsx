import { AppDetailsUrlQueryParams, AppInstallUrlQueryParams } from "@dashboard/apps/urls";
import SectionRoute from "@dashboard/auth/components/SectionRoute";
import { PermissionEnum } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import {
  AppInstallView,
  AppListView,
  AppManageView,
  AppPermissionRequestView,
  AppView,
} from "src/apps/views";

import { WindowTitle } from "../components/WindowTitle";
import { AppListUrlQueryParams, AppPaths } from "./urls";

const AppManageRoute: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
  const qs = parseQs(location.search.substr(1));
  const params: AppDetailsUrlQueryParams = qs;

  return <AppManageView id={decodeURIComponent(match.params.id)} params={params} />;
};
const AppViewRoute: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => (
  <AppView id={decodeURIComponent(match.params.id)} />
);
const AppInstallRoute: React.FC<RouteComponentProps> = props => {
  const qs = parseQs(location.search.substr(1));
  const params: AppInstallUrlQueryParams = qs;

  return <AppInstallView params={params} {...props} />;
};
const AppListRoute: React.FC<RouteComponentProps> = () => {
  const qs = parseQs(location.search.substr(1));
  const params: AppListUrlQueryParams = qs;

  return <AppListView params={params} />;
};

export const AppsSectionRoot = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.apps)} />
      <Switch>
        <Route exact path={AppPaths.appListPath} component={AppListRoute} />
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
      </Switch>
    </>
  );
};
