import {
  AppDetailsUrlQueryParams,
  AppInstallUrlQueryParams,
} from "@dashboard/apps/urls";
import SectionRoute from "@dashboard/auth/components/SectionRoute";
import { PermissionEnum } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Routes } from "react-router-dom";
import {
  AppInstallView,
  AppListView,
  AppManageView,
  AppPermissionRequestView,
  AppView,
} from "src/apps/views";

import { WindowTitle } from "../components/WindowTitle";
import { AppListUrlQueryParams, AppPaths } from "./urls";

const AppManageRoute: React.FC<RouteComponentProps<{ id: string }>> = ({
  match,
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: AppDetailsUrlQueryParams = qs;

  return (
    <AppManageView id={decodeURIComponent(match.params.id)} params={params} />
  );
};

const AppViewRoute: React.FC<RouteComponentProps<{ id: string }>> = ({
  match,
}) => <AppView id={decodeURIComponent(match.params.id)} />;

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
      <Routes>
        <Route path={AppPaths.appListPath} element={AppListRoute} />
        <SectionRoute
          exact
          permissions={[PermissionEnum.MANAGE_APPS]}
          path={AppPaths.appInstallPath}
          element={AppInstallRoute}
        />
        <Route
          path={AppPaths.resolveAppDetailsPath(":id")}
          element={AppManageRoute}
        />
        <SectionRoute
          exact
          permissions={[PermissionEnum.MANAGE_APPS]}
          path={AppPaths.resolveRequestPermissionsPath(":id")}
          element={AppPermissionRequestView}
        />
        <Route path={AppPaths.resolveAppPath(":id")} element={AppViewRoute} />
      </Routes>
    </>
  );
};
