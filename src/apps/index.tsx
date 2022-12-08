import WebhooksRoutes from "@saleor/custom-apps";
import { sectionNames } from "@saleor/intl";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  appDetailsPath,
  AppDetailsUrlQueryParams,
  appInstallPath,
  AppInstallUrlQueryParams,
  AppListUrlQueryParams,
  appPath,
  appsListPath,
} from "./urls";
import AppView from "./views/App";
import AppDetailsView from "./views/AppDetails";
import AppInstallView from "./views/AppInstall";
import AppsListView from "./views/AppsList";

const AppDetails: React.FC<RouteComponentProps<{ id: string }>> = ({
  match,
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: AppDetailsUrlQueryParams = qs;

  return (
    <AppDetailsView id={decodeURIComponent(match.params.id)} params={params} />
  );
};

const App: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => (
  <AppView id={decodeURIComponent(match.params.id)} />
);

const AppInstall: React.FC<RouteComponentProps> = props => {
  const qs = parseQs(location.search.substr(1));
  const params: AppInstallUrlQueryParams = qs;

  return <AppInstallView params={params} {...props} />;
};

const AppsList: React.FC<RouteComponentProps> = () => {
  const qs = parseQs(location.search.substr(1));
  const params: AppListUrlQueryParams = qs;

  return <AppsListView params={params} />;
};
const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.apps)} />
      <Switch>
        <Route exact path={appsListPath} component={AppsList} />
        <Route exact path={appInstallPath} component={AppInstall} />
        <Route exact path={appDetailsPath(":id")} component={AppDetails} />
        <Route path={appPath(":id")} component={App} />
        <WebhooksRoutes />
      </Switch>
    </>
  );
};

export default Component;
