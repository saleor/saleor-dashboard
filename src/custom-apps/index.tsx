// @ts-strict-ignore
import { Route } from "@dashboard/components/Router";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { useFlag } from "@dashboard/featureFlags";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { parse as parseQs } from "qs";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { RouteComponentProps, Switch } from "react-router-dom";

import {
  CustomAppDetailsUrlQueryParams,
  CustomAppListUrlQueryParams,
  CustomAppPaths,
} from "./urls";
import CustomAppCreateView from "./views/CustomAppCreate";
import CustomAppDetailsView from "./views/CustomAppDetails";
import CustomAppListView from "./views/CustomAppList";
import CustomAppWebhookCreateView from "./views/CustomAppWebhookCreate";
import CustomAppWebhookDetailsView from "./views/CustomAppWebhookDetails";

interface MatchParams {
  appId?: string;
}

interface MatchParamsWebhookDetails {
  id?: string;
}

const CustomAppList: React.FC<RouteComponentProps> = () => {
  const qs = parseQs(location.search.substr(1));
  const params: CustomAppListUrlQueryParams = qs;

  return <CustomAppListView params={params} />;
};

interface CustomAppDetailsProps extends RouteComponentProps<{ id?: string }> {
  token: string;
  onTokenClose: () => void;
}

const CustomAppDetails: React.FC<CustomAppDetailsProps> = ({ match, token, onTokenClose }) => {
  const qs = parseQs(location.search.substr(1));
  const params: CustomAppDetailsUrlQueryParams = qs;
  const id = match.params.id;

  if (!id) {
    throw new Error("No ID provided");
  }

  return (
    <CustomAppDetailsView
      id={decodeURIComponent(id)}
      params={params}
      token={token}
      onTokenClose={onTokenClose}
    />
  );
};
const CustomAppWebhookCreate: React.FC<RouteComponentProps<MatchParams>> = ({ match }) => {
  const appId = match.params.appId;

  if (!appId) {
    throw new Error("No App ID provided");
  }

  return <CustomAppWebhookCreateView appId={decodeURIComponent(appId)} />;
};
const CustomAppWebhookDetails: React.FC<RouteComponentProps<MatchParamsWebhookDetails>> = ({
  match,
}) => {
  const id = match.params.id;

  if (!id) {
    throw new Error("No ID provided");
  }

  return <CustomAppWebhookDetailsView id={decodeURIComponent(id)} />;
};
const Component = () => {
  const intl = useIntl();
  const [token, setToken] = useState<string>(null);
  const navigate = useNavigator();
  const { enabled: isExtensionsEnabled } = useFlag("extensions");

  if (isExtensionsEnabled) {
    navigate(ExtensionsUrls.resolveInstalledExtensionsUrl(), { replace: true });

    return <>Redirecting...</>;
  }

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.webhooksAndEvents)} />
      <Switch>
        <Route exact path={CustomAppPaths.appListPath} component={CustomAppList} />
        <Route
          exact
          path={CustomAppPaths.appAddPath}
          render={() => <CustomAppCreateView setToken={setToken} />}
        />
        <Route
          exact
          path={CustomAppPaths.resolveAppPath(":id")}
          render={props => (
            <CustomAppDetails {...props} token={token} onTokenClose={() => setToken(null)} />
          )}
        />
        <Route
          exact
          path={CustomAppPaths.resolveWebhookAddPath(":appId")}
          component={CustomAppWebhookCreate}
        />
        <Route
          exact
          path={CustomAppPaths.resolveWebhookPath(":appId", ":id")}
          component={CustomAppWebhookDetails}
        />
      </Switch>
    </>
  );
};

export default Component;
