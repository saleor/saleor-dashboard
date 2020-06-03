import { sectionNames } from "@saleor/intl";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  AppDetailsUrlQueryParams,
  AppListUrlQueryParams,
  appPath,
  customAppPath,
  CustomAppUrlQueryParams
} from "./urls";
import { appsListPath } from "./urls";
import AppDetailsView from "./views/AppDetails";
import AppsListView from "./views/AppsList";
import CustomAppDetailsView from "./views/CustomAppDetails";

const AppDetails: React.FC<RouteComponentProps<{ id: string }>> = ({
  match
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: AppDetailsUrlQueryParams = qs;

  return (
    <AppDetailsView id={decodeURIComponent(match.params.id)} params={params} />
  );
};

interface CustomAppDetailsProps extends RouteComponentProps<{ id: string }> {
  token: string;
  onTokenClose: () => void;
}

const CustomAppDetails: React.FC<CustomAppDetailsProps> = ({
  match,
  token,
  onTokenClose
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: CustomAppUrlQueryParams = qs;

  return (
    <CustomAppDetailsView
      id={decodeURIComponent(match.params.id)}
      params={params}
      token={token}
      onTokenClose={onTokenClose}
    />
  );
};

const AppsList: React.FC<RouteComponentProps> = props => {
  const qs = parseQs(location.search.substr(1));
  const params: AppListUrlQueryParams = qs;

  return <AppsListView params={params} {...props} />;
};

const Component = () => {
  const intl = useIntl();
  const [token, setToken] = React.useState<string>(null);

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.apps)} />
      <Switch>
        <Route exact path={appsListPath} component={AppsList} />
        <Route exact path={appPath(":id")} component={AppDetails} />
        <Route
          exact
          path={customAppPath(":id")}
          render={props => (
            <CustomAppDetails
              {...props}
              token={token}
              onTokenClose={() => setToken(null)}
            />
          )}
        />
      </Switch>
    </>
  );
};

export default Component;
