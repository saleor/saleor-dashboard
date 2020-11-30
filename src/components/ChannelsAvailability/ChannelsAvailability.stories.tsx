import { createChannelsDataFromProduct } from "@saleor/channels/utils";
import { User } from "@saleor/fragments/types/User";
import { product } from "@saleor/products/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import UserDecorator from "@saleor/storybook/UserDecorator";
import { PermissionEnum } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import ChannelsAvailability, {
  ChannelsAvailabilityProps
} from "./ChannelsAvailability";

const user: User = {
  __typename: "User",
  avatar: null,
  email: "email@example.com",
  firstName: "User",
  id: "123",
  lastName: "User",
  userPermissions: [
    {
      __typename: "UserPermission",
      code: PermissionEnum.MANAGE_CHANNELS,
      name: "Manage Channels"
    }
  ]
};

const productChannels = createChannelsDataFromProduct(product(""));

const props: ChannelsAvailabilityProps = {
  allChannelsCount: 4,
  channelsList: productChannels.map(channel => ({
    id: channel.id,
    name: channel.name
  })),
  errors: [],
  onChange: () => undefined,
  openModal: () => undefined,
  selectedChannelsCount: 3
};

storiesOf("Generics / ChannelsAvailability", module)
  .addDecorator(Decorator)
  .addDecorator(UserDecorator(user))
  .add("default", () => <ChannelsAvailability {...props} />)
  .add("with onChange", () => (
    <ChannelsAvailability
      {...props}
      channelsList={undefined}
      channels={productChannels}
      channelsMessages={productChannels.reduce(
        (prevVal, currVal) => ({
          ...prevVal,
          [currVal.id]: {
            availableLabel: "Available",
            availableSecondLabel: "Will become available",
            hiddenSecondLabel: "Will become published"
          }
        }),
        {}
      )}
    />
  ));
