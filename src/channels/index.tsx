import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  channelAddPath,
  channelsListPath,
  ChannelsListUrlQueryParams,
  ChannelsListUrlSortField
} from "./urls";
import ChannelCreateComponent from "./views/ChannelCreate";
import ChannelsListComponent from "./views/ChannelsList";

const ChannelsList: React.FC<RouteComponentProps> = ({ location }) => {
  const qs = parseQs(location.search.substr(1));
  const params: ChannelsListUrlQueryParams = asSortParams(
    qs,
    ChannelsListUrlSortField
  );
  return <ChannelsListComponent params={params} />;
};

export const ChannelsSection: React.FC<{}> = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.channels)} />
      <Switch>
        <Route exact path={channelsListPath} component={ChannelsList} />
        <Route exact path={channelAddPath} component={ChannelCreateComponent} />
      </Switch>
    </>
  );
};
export default ChannelsSection;
