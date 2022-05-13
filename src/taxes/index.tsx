import { sectionNames } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import { channelsListUrl } from "./urls";
import ChannelsListComponent from "./views/TaxesList";

const ChannelsList: React.FC<RouteComponentProps<{ id: string }>> = ({
  match
}) => <ChannelsListComponent id={decodeURIComponent(match.params.id)} />;

const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.taxes)} />
      <Switch>
        <Route path={channelsListUrl(":id")} component={ChannelsList} />
        <Route path={channelsListUrl()} component={ChannelsList} />
      </Switch>
    </>
  );
};

export default Component;
