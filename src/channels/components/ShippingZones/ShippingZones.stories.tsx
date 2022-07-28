import { ChannelShippingZones } from "@saleor/channels/pages/ChannelDetailsPage/types";
import CommonDecorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import ShippingZones from "./ShippingZones";

const shippingZones = [
  {
    __typename: "ShippingZone",
    id: "2",
    name: "Fancy shipping zone",
  },
  {
    __typename: "ShippingZone",
    id: "3",
    name: "Nice shipping zone",
  },
];

const baseProps = {
  addShippingZone: () => undefined,
  removeShippingZone: () => undefined,
  searchShippingZones: () => undefined,
  fetchMoreShippingZones: {
    loading: false,
    hasMore: false,
    onFetchMore: () => undefined,
    totalCount: 0,
  },
  shippingZones: [],
  shippingZonesChoices: shippingZones as ChannelShippingZones,
};

storiesOf("Shipping zones", module)
  .addDecorator(CommonDecorator)
  .add("with no options selected", () => <ShippingZones {...baseProps} />)
  .add("with options selected", () => (
    <ShippingZones
      {...baseProps}
      shippingZones={shippingZones as ChannelShippingZones}
    />
  ));
