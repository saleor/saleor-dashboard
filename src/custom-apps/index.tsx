// @ts-strict-ignore
import { Route } from "@dashboard/components/Router";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { sectionNames } from "@dashboard/intl";
import { parse as parseQs } from "qs";
import { useState } from "react";
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

const CustomAppList = () => {
  const qs = parseQs(location.search.substr(1));
  const params: CustomAppListUrlQueryParams = qs;

  return <CustomAppListView params={params} />;
};

interface CustomAppDetailsProps extends RouteComponentProps<{ id?: string }> {
  token: string;
  onTokenClose: () => void;
}

const CustomAppDetails = ({ match, token, onTokenClose }: CustomAppDetailsProps) => {
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
const CustomAppWebhookCreate = ({ match }: RouteComponentProps<MatchParams>) => {
  const appId = match.params.appId;

  if (!appId) {
    throw new Error("No App ID provided");
  }

  return <CustomAppWebhookCreateView appId={decodeURIComponent(appId)} />;
};
const CustomAppWebhookDetails = ({ match }: RouteComponentProps<MatchParamsWebhookDetails>) => {
  const id = match.params.id;

  if (!id) {
    throw new Error("No ID provided");
  }

  return <CustomAppWebhookDetailsView id={decodeURIComponent(id)} />;
};
const Component = () => {
  const intl = useIntl();
  const [token, setToken] = useState<string>(null);

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
