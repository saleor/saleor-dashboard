import { createChannelsDataFromProduct } from "@saleor/channels/utils";
import { PermissionEnum, UserFragment } from "@saleor/graphql";
import { product } from "@saleor/products/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import UserDecorator from "@saleor/storybook/UserDecorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import ChannelsAvailabilityCard, {
  ChannelsAvailabilityCardProps,
} from "./ChannelsAvailabilityCard";

const user: UserFragment = {
  __typename: "User",
  avatar: null,
  email: "email@example.com",
  firstName: "User",
  id: "123",
  isStaff: true,
  lastName: "User",
  userPermissions: [
    {
      __typename: "UserPermission",
      code: PermissionEnum.MANAGE_CHANNELS,
      name: "Manage Channels",
    },
  ],
};

const productChannels = createChannelsDataFromProduct(product(""));

const props: ChannelsAvailabilityCardProps = {
  allChannelsCount: 4,
  managePermissions: [PermissionEnum.MANAGE_CHANNELS],
  channelsList: productChannels.map(channel => ({
    id: channel.id,
    name: channel.name,
  })),
  errors: [],
  onChange: () => undefined,
  openModal: () => undefined,
};

storiesOf("Generics / Channels availability card", module)
  .addDecorator(Decorator)
  .addDecorator(UserDecorator(user))
  .add("default", () => <ChannelsAvailabilityCard {...props} />)
  .add("with onChange", () => (
    <ChannelsAvailabilityCard
      {...props}
      channelsList={undefined}
      channels={productChannels}
      messages={{
        availableLabel: "Available",
        availableSecondLabel: "Will become available",
        unavailableLabel: "Lorem Ipsum",
        visibleSecondLabel: "Dolor Sit Amet",
        hiddenSecondLabel: "Will become published",
        hiddenLabel: "Hidden",
        visibleLabel: "Visible",
        availableDateText: "available from 07/30/2020",
        setAvailabilityDateLabel: "xd4",
      }}
    />
  ));
