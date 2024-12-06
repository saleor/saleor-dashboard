import { Route } from "@dashboard/components/Router";
import { sectionNames } from "@dashboard/intl";
import { asSortParams } from "@dashboard/utils/sort";
import { parse as parseQs } from "qs";
import { useIntl } from "react-intl";
import { RouteComponentProps, Switch } from "react-router-dom";

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

const PluginList = ({ location }: RouteComponentProps<any>) => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: PluginListUrlQueryParams = asSortParams(qs, PluginListUrlSortField);

  return <PluginsListComponent params={params} />;
};
const PageDetails = ({ match }: RouteComponentProps<any>) => {
  const qs = parseQs(location.search.substr(1));
  const params: PluginUrlQueryParams = qs;

  return <PluginsDetailsComponent id={decodeURIComponent(match.params.id)} params={params} />;
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
