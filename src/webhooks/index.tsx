import { WindowTitle } from "@saleor/components/WindowTitle";
import { sectionNames } from "@saleor/intl";
import WebhooksCreateView from "@saleor/webhooks/views/WebhooksCreate";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import {
  webhookAddPath,
  webhookListPath,
  WebhookListUrlQueryParams,
  webhookPath,
} from "./urls";
import WebhooksDetails from "./views/WebhooksDetails";
import WebhooksList from "./views/WebhooksList";

const WebhookList: React.FC<RouteComponentProps> = () => {
  const qs = parseQs(location.search.substr(1));
  const params: WebhookListUrlQueryParams = qs;

  return <WebhooksList params={params} />;
};

const WebhookDetails: React.FC<RouteComponentProps<any>> = ({ match }) => (
  <WebhooksDetails id={decodeURIComponent(match.params.id)} />
);

const WebhookCreate: React.FC<RouteComponentProps<any>> = ({ match }) => (
  <WebhooksCreateView id={decodeURIComponent(match.params.id)} />
);

const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.webhooksAndEvents)} />
      <Switch>
        <Route exact path={webhookListPath} component={WebhookList} />
        <Route exact path={webhookAddPath(":id")} component={WebhookCreate} />
        <Route exact path={webhookPath(":id")} component={WebhookDetails} />
      </Switch>
    </>
  );
};

export default Component;
