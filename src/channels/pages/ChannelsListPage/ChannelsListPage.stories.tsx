import { channelsList } from "@dashboard/channels/fixtures";
import { limits, limitsReached } from "@dashboard/fixtures";
import React from "react";

import ChannelsListPage, { ChannelsListPageProps } from "./ChannelsListPage";

const props: ChannelsListPageProps = {
  channelsList,
  limits,
  onRemove: () => undefined,
};

export default {
  title: "Channels / Channels list",
};

export const Default = () => <ChannelsListPage {...props} />;

export const Empty = () => <ChannelsListPage {...props} channelsList={[]} />;

export const NoLimits = () => (
  <ChannelsListPage {...props} limits={undefined} />
);

export const LimitsReached = () => (
  <ChannelsListPage {...props} limits={limitsReached} />
);
