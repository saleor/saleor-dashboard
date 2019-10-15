import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { sectionNames } from "@saleor/intl";
import { WindowTitle } from "../components/WindowTitle";
import {
  webhooksAddUrl,
  webhooksListPath,
  WebhooksListUrlQueryParams,
  webhooksPath
} from "./urls";
import WebhookCreate from "./views/WebhooksCreate";
import WebhooksDetails from "./views/WebhooksDetails";
import WebhooksList from "./views/WebhooksList";

const WebhookList: React.StatelessComponent<RouteComponentProps<any>> = ({
  location
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: WebhooksListUrlQueryParams = qs;
  return <WebhooksList params={params} />;
};

const WebhookDetails: React.StatelessComponent<RouteComponentProps<any>> = ({
  match
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: WebhooksListUrlQueryParams = qs;

  return (
    <WebhooksDetails id={decodeURIComponent(match.params.id)} params={params} />
  );
};

const Component = () => {
  const intl = useIntl();
  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.webhooks)} />
      <Switch>
        <Route exact path={webhooksListPath} component={WebhookList} />
        <Route exact path={webhooksAddUrl} component={WebhookCreate} />
        <Route path={webhooksPath(":id")} component={WebhookDetails} />
      </Switch>
    </>
  );
};

export default Component;
