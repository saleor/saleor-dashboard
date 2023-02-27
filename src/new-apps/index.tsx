import { AppDetailsUrlQueryParams, AppInstallUrlQueryParams } from "@dashboard/apps/urls";
import { AppView } from "@dashboard/apps/views/App";
import AppDetailsView from "@dashboard/apps/views/AppDetails";
import AppInstallView from "@dashboard/apps/views/AppInstall";
import { sectionNames } from "@dashboard/intl";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import { AppListUrlQueryParams, AppPaths } from "./urls";
import AppListView from "./views/AppList";

const AppDetails: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
  const qs = parseQs(location.search.substr(1));
  const params: AppDetailsUrlQueryParams = qs;

  return <AppDetailsView id={decodeURIComponent(match.params.id)} params={params} />;
};

const AppViewRoute: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => (
  <AppView id={decodeURIComponent(match.params.id)} />
);

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
        <Route exact path={AppPaths.resolveAppDetailsPath(":id")} component={AppDetails} />
        <Route path={AppPaths.resolveAppPath(":id")} component={AppViewRoute} />
      </Switch>
    </>
  );
};

export default Apps;
