import useQueryParams from "@saleor/hooks/useQueryParams";
import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  pluginListPath,
  PluginListUrlQueryParams,
  PluginListUrlSortField,
  pluginPath,
  PluginUrlQueryParams,
} from "./urls";
import PluginsListComponent from "./views/PluginList";
import PluginsDetailsComponent from "./views/PluginsDetails";

const PluginList: React.FC<RouteComponentProps<any>> = () => {
  const qs = useQueryParams<PluginListUrlQueryParams>();
  const params: PluginListUrlQueryParams = asSortParams(
    qs,
    PluginListUrlSortField,
  );
  return <PluginsListComponent params={params} />;
};

const PageDetails: React.FC<RouteComponentProps<any>> = ({ match }) => {
  const qs = useQueryParams<PluginUrlQueryParams>();
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
