import { ChannelShippingZones } from "@saleor/channels/pages/ChannelDetailsPage/types";
import CommonDecorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import ShippingZonesCard from "./ShippingZonesCard";

const shippingZones = [
  {
    __typename: "ShippingZone",
    id: "2",
    name: "Fancy shipping zone"
  },
  {
    __typename: "ShippingZone",
    id: "3",
    name: "Nice shipping zone"
  }
];

const baseProps = {
  addShippingZone: () => undefined,
  removeShippingZone: () => undefined,
  searchShippingZones: () => undefined,
  fetchMoreShippingZones: {
    loading: false,
    hasMore: false,
    onFetchMore: () => undefined
  },
  shippingZones: [],
  shippingZonesChoices: shippingZones as ChannelShippingZones
};

storiesOf("Shipping zones card", module)
  .addDecorator(CommonDecorator)
  .add("with no options selected", () => <ShippingZonesCard {...baseProps} />)
  .add("with options selected", () => (
    <ShippingZonesCard
      {...baseProps}
      shippingZones={shippingZones as ChannelShippingZones}
    />
  ));
