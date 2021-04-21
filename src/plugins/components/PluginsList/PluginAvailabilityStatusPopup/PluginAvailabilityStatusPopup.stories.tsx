import CommonDecorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import PluginAvailabilityStatusPopup from "./index";

const commonProps = {
  isOpen: true,
  anchor: null
};

storiesOf("Plugins list / Plugin availability status popup", module)
  .addDecorator(CommonDecorator)
  .add("Global config (active)", () => (
    <PluginAvailabilityStatusPopup
      {...commonProps}
      plugin={{
        __typename: "Plugin",
        id: "plugin-1",
        name: "Fancy plugin",
        description: "This sentence describes this plugin in the perfect way.",
        channelConfigurations: null,
        globalConfiguration: {
          __typename: "PluginConfiguration",
          active: true,
          channel: null,
          configuration: null
        }
      }}
    />
  ))
  .add("Global config (inactive)", () => (
    <PluginAvailabilityStatusPopup
      {...commonProps}
      plugin={{
        __typename: "Plugin",
        id: "plugin-1",
        name: "Fancy plugin",
        description: "This sentence describes this plugin in the perfect way.",
        channelConfigurations: null,
        globalConfiguration: {
          __typename: "PluginConfiguration",
          active: false,
          channel: null,
          configuration: null
        }
      }}
    />
  ))
  .add("Channel config", () => (
    <PluginAvailabilityStatusPopup
      {...commonProps}
      plugin={{
        __typename: "Plugin",
        id: "plugin-1",
        name: "Fancy plugin",
        description: "This sentence describes this plugin in the perfect way.",
        globalConfiguration: null,
        channelConfigurations: [
          {
            __typename: "PluginConfiguration",
            active: true,
            channel: {
              __typename: "Channel",
              id: "channel-1",
              name: "Poland channel",
              slug: "channel-1"
            },
            configuration: null
          },
          {
            __typename: "PluginConfiguration",
            active: false,
            channel: {
              __typename: "Channel",
              id: "channel-2",
              name: "China channel",
              slug: "channel-2"
            },
            configuration: null
          }
        ]
      }}
    />
  ));
