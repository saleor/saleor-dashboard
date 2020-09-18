import WebhooksCreateView from "@saleor/webhooks/views/WebhooksCreate";
import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";

import { webhookAddPath, webhookPath } from "./urls";
import WebhooksDetails from "./views/WebhooksDetails";

const WebhookDetails: React.FC<RouteComponentProps<any>> = ({ match }) => (
  <WebhooksDetails id={decodeURIComponent(match.params.id)} />
);

const WebhookCreate: React.FC<RouteComponentProps<any>> = ({ match }) => (
  <WebhooksCreateView id={decodeURIComponent(match.params.id)} />
);

const Component = () => (
  <>
    <Route exact path={webhookAddPath(":id")} component={WebhookCreate} />
    <Route path={webhookPath(":id")} component={WebhookDetails} />
  </>
);

export default Component;
