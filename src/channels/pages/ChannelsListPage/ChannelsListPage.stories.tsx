import { channelsList } from "@dashboard/channels/fixtures";
import { limits, limitsReached } from "@dashboard/fixtures";
import { Meta, StoryObj } from "@storybook/react";

import ChannelsListPage, { ChannelsListPageProps } from "./ChannelsListPage";

const props: ChannelsListPageProps = {
  channelsList,
  limits,
  onRemove: () => undefined,
};

const meta: Meta<typeof ChannelsListPage> = {
  title: "Channels / Channels list",
  component: ChannelsListPage,
};
export default meta;
type Story = StoryObj<typeof ChannelsListPage>;

export const Default: Story = {
  args: {
    ...props,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const Empty: Story = {
  args: {
    ...props,
    channelsList: [],
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const NoLimits: Story = {
  args: {
    ...props,
    limits: undefined,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const LimitsReached: Story = {
  args: {
    ...props,
    limits: limitsReached,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};
