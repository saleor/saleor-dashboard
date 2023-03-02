import { sectionNames } from "@dashboard/intl";
import {
  AppDetailsUrlQueryParams,
  AppInstallUrlQueryParams,
} from "@dashboard/new-apps/urls";
import AppInstallView from "@dashboard/new-apps/views/AppInstall";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import { AppListUrlQueryParams, AppPaths } from "./urls";
import AppDetailsView from "./views/AppDetails";
import AppListView from "./views/AppList";
import AppView from "./views/AppView";

const AppDetails: React.FC<RouteComponentProps<{ id: string }>> = ({
  match,
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: AppDetailsUrlQueryParams = qs;

  return (
    <AppDetailsView id={decodeURIComponent(match.params.id)} params={params} />
  );
};

const AppViewRoute: React.FC<RouteComponentProps<{ id: string }>> = ({
  match,
}) => <AppView id={decodeURIComponent(match.params.id)} />;

const AppInstall: React.FC<RouteComponentProps> = props => {
  const qs = parseQs(location.search.substr(1));
  const params: AppInstallUrlQueryParams = qs;

  return <AppInstallView params={params} {...props} />;
};

const AppList: React.FC<RouteComponentProps> = () => {
  const qs = parseQs(location.search.substr(1));
  const params: AppListUrlQueryParams = qs;

  return <AppListView params={params} />;
};

const Apps = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.apps)} />
      <Switch>
        <Route exact path={AppPaths.appListPath} component={AppList} />
        <Route exact path={AppPaths.appInstallPath} component={AppInstall} />
        <Route
          exact
          path={AppPaths.resolveAppDetailsPath(":id")}
          component={AppDetails}
        />
        <Route path={AppPaths.resolveAppPath(":id")} component={AppViewRoute} />
      </Switch>
    </>
  );
};

export default Apps;
