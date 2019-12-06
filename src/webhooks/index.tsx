import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import { WindowTitle } from "../components/WindowTitle";
import {
  webhookAddUrl,
  webhookListPath,
  WebhookListUrlQueryParams,
  webhookPath,
  WebhookUrlQueryParams,
  WebhookListUrlSortField
} from "./urls";
import WebhookCreate from "./views/WebhooksCreate";
import WebhooksDetails from "./views/WebhooksDetails";
import WebhooksList from "./views/WebhookList";

const WebhookList: React.FC<RouteComponentProps<any>> = ({ location }) => {
  const qs = parseQs(location.search.substr(1));
  const params: WebhookListUrlQueryParams = asSortParams(
    qs,
    WebhookListUrlSortField
  );

  return <WebhooksList params={params} />;
};

const WebhookDetails: React.FC<RouteComponentProps<any>> = ({ match }) => {
  const qs = parseQs(location.search.substr(1));
  const params: WebhookUrlQueryParams = qs;

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
        <Route exact path={webhookListPath} component={WebhookList} />
        <Route exact path={webhookAddUrl} component={WebhookCreate} />
        <Route path={webhookPath(":id")} component={WebhookDetails} />
      </Switch>
    </>
  );
};

export default Component;
