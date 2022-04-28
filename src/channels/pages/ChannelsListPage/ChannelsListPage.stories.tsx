import { limits, limitsReached } from "@saleor/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import { channelsList } from "../../fixtures";
import ChannelsListPage, { ChannelsListPageProps } from "./ChannelsListPage";

const props: ChannelsListPageProps = {
  channelsList,
  limits,
  navigateToChannelCreate: () => undefined,
  onBack: () => undefined,
  onRemove: () => undefined,
  onRowClick: () => undefined
};

export default {
  title: "Views / Channels / Channels list",
  decorators: [Decorator]
};

export const Default = () => <ChannelsListPage {...props} />;

Default.story = {
  name: "default"
};

export const Empty = () => <ChannelsListPage {...props} channelsList={[]} />;

Empty.story = {
  name: "empty"
};

export const NoLimits = () => (
  <ChannelsListPage {...props} limits={undefined} />
);

NoLimits.story = {
  name: "no limits"
};

export const LimitsReached = () => (
  <ChannelsListPage {...props} limits={limitsReached} />
);

LimitsReached.story = {
  name: "limits reached"
};
