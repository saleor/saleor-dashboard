import { limits, limitsReached } from "@saleor/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { channelsList } from "../../fixtures";
import ChannelsListPage, { ChannelsListPageProps } from "./ChannelsListPage";

const props: ChannelsListPageProps = {
  channelsList,
  limits,
  onRemove: () => undefined,
};

storiesOf("Views / Channels / Channels list", module)
  .addDecorator(Decorator)
  .add("default", () => <ChannelsListPage {...props} />)
  .add("empty", () => <ChannelsListPage {...props} channelsList={[]} />)
  .add("no limits", () => <ChannelsListPage {...props} limits={undefined} />)
  .add("limits reached", () => (
    <ChannelsListPage {...props} limits={limitsReached} />
  ));
