import CommonDecorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import PluginAvailabilityStatusPopup from "./index";

storiesOf("Plugins list / Plugin availability status popup", module)
  .addDecorator(CommonDecorator)
  .add("Global config (active)", () => (
    <PluginAvailabilityStatusPopup
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
              name: "Poland channel"
            },
            configuration: null
          },
          {
            __typename: "PluginConfiguration",
            active: false,
            channel: {
              __typename: "Channel",
              id: "channel-2",
              name: "China channel"
            },
            configuration: null
          }
        ]
      }}
    />
  ));
