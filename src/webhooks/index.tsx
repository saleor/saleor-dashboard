import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { sectionNames } from "@saleor/intl";
import { WindowTitle } from "../components/WindowTitle";
import {
  webhooksListPath,
  WebhooksListUrlQueryParams,
  webhooksPath
} from "./urls";
import WebhooksDetails from "./views/WebhooksDetails";
import WebhooksList from "./views/WebhooksList";

const WebhookList: React.StatelessComponent<RouteComponentProps<any>> = ({
  location
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: WebhooksListUrlQueryParams = qs;
  return <WebhooksList params={params} />;
};

const PageDetails: React.StatelessComponent<RouteComponentProps<any>> = ({
  match
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: WebhooksListUrlQueryParams = qs;

  return (
    <WebhooksDetails
      id={decodeURIComponent(match.params.id)}
      params={params}
    />
  );
};

const Component = () => {
  const intl = useIntl();
  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.plugins)} />
      <Switch>
        <Route exact path={webhooksListPath} component={WebhookList} />
        <Route path={webhooksPath(":id")} component={WebhooksDetails} />
      </Switch>
    </>
  );
};

export default Component;
