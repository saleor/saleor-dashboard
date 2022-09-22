import { ChannelShippingZones } from "@saleor/channels/pages/ChannelDetailsPage/types";
import CommonDecorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import ShippingZones, { ShippingZonesProps } from "./ShippingZones";

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

const baseProps: ShippingZonesProps = {
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
  totalCount: 10,
  loading: false,
};

storiesOf("Shipping zones", module)
  .addDecorator(CommonDecorator)
  .add("with no options selected", () => <ShippingZones {...baseProps} />)
  .add("with options selected", () => (
    <ShippingZones
      {...baseProps}
      shippingZones={shippingZones as ChannelShippingZones}
    />
  ))
  .add("loading", () => <ShippingZones {...baseProps} loading={true} />);
