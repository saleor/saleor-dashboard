import { Route } from "@dashboard/components/Router";
import { sectionNames } from "@dashboard/intl";
import { parseQs } from "@dashboard/url-utils";
import { asSortParams } from "@dashboard/utils/sort";
import { useIntl } from "react-intl";
import { RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  channelAddPath,
  channelPath,
  channelsListPath,
  ChannelsListUrlQueryParams,
  ChannelsListUrlSortField,
} from "./urls";
import ChannelCreateComponent from "./views/ChannelCreate";
import ChannelDetailsComponent from "./views/ChannelDetails";
import ChannelsListComponent from "./views/ChannelsList";

const ChannelDetails = ({ match }: RouteComponentProps<any>) => {
  const params = parseQs(location.search.substr(1));

  return <ChannelDetailsComponent id={decodeURIComponent(match.params.id)} params={params} />;
};
const ChannelsList = ({ location }: RouteComponentProps) => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: ChannelsListUrlQueryParams = asSortParams(qs, ChannelsListUrlSortField);

  return <ChannelsListComponent params={params} />;
};

const ChannelsSection = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.channels)} />
      <Switch>
        <Route exact path={channelsListPath} component={ChannelsList} />
        <Route exact path={channelAddPath} component={ChannelCreateComponent} />
        <Route exact path={channelPath(":id")} component={ChannelDetails} />
      </Switch>
    </>
  );
};

export default ChannelsSection;
