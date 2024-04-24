import { sectionNames } from "@dashboard/intl";
import { asSortParams } from "@dashboard/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Routes } from "react-router-dom";

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

const ChannelDetails: React.FC<RouteComponentProps<any>> = ({ match }) => {
  const params = parseQs(location.search.substr(1));

  return (
    <ChannelDetailsComponent
      id={decodeURIComponent(match.params.id)}
      params={params}
    />
  );
};

const ChannelsList: React.FC<RouteComponentProps> = ({ location }) => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: ChannelsListUrlQueryParams = asSortParams(
    qs,
    ChannelsListUrlSortField,
  );
  return <ChannelsListComponent params={params} />;
};

export const ChannelsSection: React.FC<{}> = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.channels)} />
      <Routes>
        <Route path={channelsListPath} element={ChannelsList} />
        <Route path={channelAddPath} element={ChannelCreateComponent} />
        <Route path={channelPath(":id")} element={ChannelDetails} />
      </Routes>
    </>
  );
};
export default ChannelsSection;
