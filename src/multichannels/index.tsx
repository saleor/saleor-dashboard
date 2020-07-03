import { sectionNames } from "@saleor/intl";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import { channelAddPath, channelsListPath } from "./urls";
import ChannelCreateComponent from "./views/ChannelCreate";
import MultichannelsListComponent from "./views/MultichannelsList";

const MultichannelsList: React.FC<RouteComponentProps> = ({ location }) => {
  const qs = parseQs(location.search.substr(1));

  return <MultichannelsListComponent params={qs} />;
};

export const MultichannelsSection: React.FC<{}> = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.channels)} />
      <Switch>
        <Route exact path={channelsListPath} component={MultichannelsList} />
        <Route exact path={channelAddPath} component={ChannelCreateComponent} />
      </Switch>
    </>
  );
};
export default MultichannelsSection;
