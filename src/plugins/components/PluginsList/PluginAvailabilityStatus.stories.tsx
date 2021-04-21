import {
  Plugins_plugins_edges_node,
  Plugins_plugins_edges_node_globalConfiguration_channel
} from "@saleor/plugins/types/Plugins";
import CardDecorator from "@saleor/storybook/CardDecorator";
import CentralPlacementDecorator from "@saleor/storybook/CentralPlacementDecorator";
import CommonDecorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import ChannelStatusLabel from "./PluginAvailabilityStatus";

const channels: Plugins_plugins_edges_node_globalConfiguration_channel[] = [
  {
    __typename: "Channel",
    id: "channel-1",
    name: "Default channel",
    slug: "channel-1"
  },
  {
    __typename: "Channel",
    id: "channel-2",
    name: "Facebook channel",
    slug: "channel-2"
  }
];

const pluginProps: Omit<
  Plugins_plugins_edges_node,
  "channelConfigurations" | "globalConfiguration"
> = {
  __typename: "Plugin",
  id: "someId",
  name: "Awesome plugin",
  description: "Best plugin there is."
};

storiesOf("Plugins list / Channel status label", module)
  .addDecorator(CommonDecorator)
  .addDecorator(CardDecorator)
  .addDecorator(CentralPlacementDecorator)
  .add("Global plugin (active)", () => (
    <ChannelStatusLabel
      plugin={{
        ...pluginProps,
        channelConfigurations: null,
        globalConfiguration: {
          __typename: "PluginConfiguration",
          configuration: [],
          active: true,
          channel: channels[0]
        }
      }}
    />
  ))
  .add("Channel dependent plugin (active)", () => (
    <ChannelStatusLabel
      plugin={{
        ...pluginProps,
        globalConfiguration: null,
        channelConfigurations: [
          {
            __typename: "PluginConfiguration",
            configuration: [],
            active: true,
            channel: channels[0]
          },
          {
            __typename: "PluginConfiguration",
            configuration: [],
            active: false,
            channel: channels[1]
          }
        ]
      }}
    />
  ))
  .add("Global plugin (inactive)", () => (
    <ChannelStatusLabel
      plugin={{
        ...pluginProps,
        channelConfigurations: null,
        globalConfiguration: {
          __typename: "PluginConfiguration",
          configuration: [],
          active: false,
          channel: channels[0]
        }
      }}
    />
  ))
  .add("Channel dependent plugin (inactive)", () => (
    <ChannelStatusLabel
      plugin={{
        ...pluginProps,
        globalConfiguration: null,
        channelConfigurations: [
          {
            __typename: "PluginConfiguration",
            configuration: [],
            active: false,
            channel: channels[0]
          },
          {
            __typename: "PluginConfiguration",
            configuration: [],
            active: false,
            channel: channels[1]
          }
        ]
      }}
    />
  ));
