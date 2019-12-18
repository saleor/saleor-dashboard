import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import { WindowTitle } from "../components/WindowTitle";
import {
  pluginListPath,
  PluginListUrlQueryParams,
  pluginPath,
  PluginUrlQueryParams,
  PluginListUrlSortField
} from "./urls";
import PluginsDetailsComponent from "./views/PluginsDetails";
import PluginsListComponent from "./views/PluginList";

const PluginList: React.FC<RouteComponentProps<any>> = ({ location }) => {
  const qs = parseQs(location.search.substr(1));
  const params: PluginListUrlQueryParams = asSortParams(
    qs,
    PluginListUrlSortField
  );
  return <PluginsListComponent params={params} />;
};

const PageDetails: React.FC<RouteComponentProps<any>> = ({ match }) => {
  const qs = parseQs(location.search.substr(1));
  const params: PluginUrlQueryParams = qs;

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
        <Route exact path={pluginListPath} component={PluginList} />
        <Route path={pluginPath(":id")} component={PageDetails} />
      </Switch>
    </>
  );
};

export default Component;
