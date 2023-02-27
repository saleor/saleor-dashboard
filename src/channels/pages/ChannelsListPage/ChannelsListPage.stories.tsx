import { channelsList } from "@dashboard/channels/fixtures";
import { limits, limitsReached } from "@dashboard/fixtures";
import Decorator from "@dashboard/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import ChannelsListPage, { ChannelsListPageProps } from "./ChannelsListPage";

const props: ChannelsListPageProps = {
  channelsList,
  limits,
  onRemove: () => undefined,
};

storiesOf("Channels / Channels list", module)
  .addDecorator(Decorator)
  .add("default", () => <ChannelsListPage {...props} />)
  .add("empty", () => <ChannelsListPage {...props} channelsList={[]} />)
  .add("no limits", () => <ChannelsListPage {...props} limits={undefined} />)
  .add("limits reached", () => <ChannelsListPage {...props} limits={limitsReached} />);
