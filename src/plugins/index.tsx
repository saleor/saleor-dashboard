import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { sectionNames } from "@saleor/intl";
import { WindowTitle } from "../components/WindowTitle";
import {
  pluginsListPath,
  PluginsListUrlQueryParams,
  pluginsPath
} from "./urls";
import PluginsDetailsComponent from "./views/PluginsDetails";
import PluginsListComponent from "./views/PluginsList";

const PluginList: React.StatelessComponent<RouteComponentProps<any>> = ({
  location
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: PluginsListUrlQueryParams = qs;
  return <PluginsListComponent params={params} />;
};

const PageDetails: React.StatelessComponent<RouteComponentProps<any>> = ({
  match
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: PluginsListUrlQueryParams = qs;

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
        <Route exact path={pluginsListPath} component={PluginList} />
        <Route path={pluginsPath(":id")} component={PageDetails} />
      </Switch>
    </>
  );
};

export default Component;
