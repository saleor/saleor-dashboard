import { WindowTitle } from "@saleor/components/WindowTitle";
import { sectionNames } from "@saleor/intl";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import {
  customAppAddPath,
  CustomAppDetailsUrlQueryParams,
  customAppListPath,
  CustomAppListUrlQueryParams,
  customAppPath,
  customAppWebhookAddPath,
  customAppWebhookPath,
} from "./urls";
import CustomAppCreateView from "./views/CustomAppCreate";
import CustomAppDetailsView from "./views/CustomAppDetails";
import CustomAppListView from "./views/CustomAppList";
import CustomAppWebhookCreateView from "./views/CustomAppWebhookCreate";
import CustomAppWebhookDetailsView from "./views/CustomAppWebhookDetails";

const CustomAppList: React.FC<RouteComponentProps> = () => {
  const qs = parseQs(location.search.substr(1));
  const params: CustomAppListUrlQueryParams = qs;

  return <CustomAppListView params={params} />;
};

interface CustomAppDetailsProps extends RouteComponentProps<{ id?: string }> {
  token: string;
  onTokenClose: () => void;
}

const CustomAppDetails: React.FC<CustomAppDetailsProps> = ({
  match,
  token,
  onTokenClose,
}) => {
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

const CustomAppWebhookCreate: React.FC<RouteComponentProps<any>> = ({
  match,
}) => {
  const appId = match.params.appId;

  if (!appId) {
    throw new Error("No App ID provided");
  }

  return <CustomAppWebhookCreateView appId={decodeURIComponent(appId)} />;
};

const CustomAppWebhookDetails: React.FC<RouteComponentProps<any>> = ({
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
  const [token, setToken] = React.useState<string>(null);

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.webhooksAndEvents)} />
      <Switch>
        <Route exact path={customAppListPath} component={CustomAppList} />
        <Route
          exact
          path={customAppAddPath}
          render={() => <CustomAppCreateView setToken={setToken} />}
        />
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
        <Route
          exact
          path={customAppWebhookAddPath(":appId")}
          component={CustomAppWebhookCreate}
        />
        <Route
          exact
          path={customAppWebhookPath(":appId", ":id")}
          component={CustomAppWebhookDetails}
        />
      </Switch>
    </>
  );
};

export default Component;
