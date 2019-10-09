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
import PluginsDetailsComponent from "./views/WebhooksDetails";
import PluginsListComponent from "./views/WebhooksList";

const PluginList: React.StatelessComponent<RouteComponentProps<any>> = ({
  location
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: WebhooksListUrlQueryParams = qs;
  return <PluginsListComponent params={params} />;
};

const PageDetails: React.StatelessComponent<RouteComponentProps<any>> = ({
  match
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: WebhooksListUrlQueryParams = qs;

  return (
    <PluginsDetailsComponent
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
        <Route exact path={webhooksListPath} component={PluginList} />
        <Route path={webhooksPath(":id")} component={PageDetails} />
      </Switch>
    </>
  );
};

export default Component;
